import {TaskParser} from '../../../../src/core/services/TaskParser';
import {Task} from '../../../../src/core/domain/Task';
import {Property} from '../../../../src/core/domain/Property';
import {DateFn} from '../../../../src/core/utility/DateFunctions';
import * as _ from 'lodash';

describe("TaskParser", function() {
  let parser: TaskParser = new TaskParser();

  describe("Parse()", function() {
    it("can identify completed items", () => {
      let task: Task = new Task();

      let completedLines: Array<string> = new Array<string>();
      completedLines.push("x Download Todo.txt mobile app @Phone");
      completedLines.push("x a completed task starts with an x");
      completedLines.push("x 2014-04-22 completion date appears directly after the x.");
      completedLines.push("x 2014-04-23 2014-04-01 completion date appears first followed by creation date");

      let notCompletedLines: Array<string> = new Array<string>();
      notCompletedLines.push("(C) Add cover sheets @Office +TPSReports");
      notCompletedLines.push("Plan backyard herb garden @Home");
      notCompletedLines.push("2014-04-23 this task has a creation date");
      notCompletedLines.push("(A) 2014-04-23 this task also has a creation date");
      notCompletedLines.push("xylophone not completed");
      notCompletedLines.push("X 2012-01-01 Also not completed");
      notCompletedLines.push("(A) x This one has a priority and is not completed");

      for (let i = 0; i < completedLines.length; i++) {
          task = parser.Parse(completedLines[i]);
          expect(task.Completed).toEqual(true);
      }

      for (let i = 0; i < notCompletedLines.length; i++) {
          task = parser.Parse(notCompletedLines[i]);
          expect(task.Completed).toEqual(false);
      }
    });

    it("can parse completed date", () => {
      let task: Task = new Task();
      let lines: Array<[string, Date | null]> = new Array<[string, Date | null]>();
      lines.push(["x  2013-07-04 completed but with an extra space", DateFn.Create(2013, 7, 4)]);
      lines.push(["x 2014-04-22 completion date appears directly after the x.", DateFn.Create(2014, 4, 22)]);
      lines.push(["x Download Todo.txt mobile app @Phone", null]);
      lines.push(["x a completed task starts with an x", null]);
      lines.push(["x 2014-04-23 2014-04-01 completion date appears first followed by creation date", DateFn.Create(2014, 4, 23)]);
      lines.push(["(C) Add cover sheets @Office +TPSReports", null]);
      lines.push(["Plan backyard herb garden @Home", null]);
      lines.push(["2014-04-23 this task has a creation date", null]);
      lines.push(["(A) 2014-04-23 this task also has a creation date", null]);
      lines.push(["xylophone not completed", null]);
      lines.push(["X 2012-01-01 Also not completed", null]);
      lines.push(["(A) x This one has a priority and is not completed", null]);

      //foreach (string key in lines.Keys)
      for (let i = 0; i < lines.length; i++) {
        let taskString: string = lines[i][0];
        let expectedDate: Date | null = lines[i][1];

        task = parser.Parse(taskString);
        expect(task.CompletedDate).toEqual(expectedDate);
      }
    });

    it("can parse created date", () => {
      let task: Task = new Task();
      let lines: Array<[string, Date | null]> = new Array<[string, Date | null]>();
      lines.push(["x Download Todo.txt mobile app @Phone", null]);
      lines.push(["x a completed task starts with an x", null]);
      lines.push(["x 2014-04-22 completion date appears directly after the x.", null]);
      lines.push(["x 2014-04-23 2014-04-01 completion date appears first followed by creation date", DateFn.Create(2014, 4, 1)]);
      lines.push(["(C) Add cover sheets @Office +TPSReports", null]);
      lines.push(["Plan backyard herb garden @Home", null]);
      lines.push(["2014-04-23 this task has a creation date", DateFn.Create(2014, 4, 23)]);
      lines.push(["(A) 2014-04-23 this task also has a creation date", DateFn.Create(2014, 4, 23)]);
      lines.push(["xylophone not completed", null]);
      lines.push(["X 2012-01-01 Also not completed", null]);
      lines.push(["(A) x This one has a priority and is not completed", null]);
      lines.push(["x 2013-06-12    2013-07-01   lots of strange   space in this one   @tommy  @the-cat  ", DateFn.Create(2013, 7, 1)]);

      for (let i = 0; i < lines.length; i++) {
        let taskString: string = lines[i][0];
        let expectedDate: Date | null = lines[i][1];

        task = parser.Parse(taskString);
        expect(task.CreatedDate).toEqual(expectedDate);
      }
    })

    it("can parse priority", () => {
      let task: Task = new Task();
      let lines: Array<[string, string | null]> = new Array<[string, string | null]>();
      lines.push(["x Download Todo.txt mobile app @Phone", null]);
      lines.push(["x a completed task starts with an x", null]);
      lines.push(["x 2014-04-22 completion date appears directly after the x.", null]);
      lines.push(["x 2014-04-23 2014-04-01 completion date appears first followed by creation date", null]);
      lines.push(["(C) Add cover sheets @Office +TPSReports", "C"]);
      lines.push(["Plan backyard herb garden @Home", null]);
      lines.push(["2014-04-23 this task has a creation date", null]);
      lines.push(["(A) 2014-04-23 this task also has a creation date", "A"]);
      lines.push(["xylophone not completed", null]);
      lines.push(["X 2012-01-01 Also not completed", null]);
      lines.push(["(A) x This one has a priority and is not completed", "A"]);
      lines.push(["(B) priority B", "B"]);
      lines.push(["(C) priority C", "C"]);
      lines.push(["(D) priority D", "D"]);
      lines.push(["(E) priority E", "E"]);
      lines.push(["(F) priority F", "F"]);
      lines.push(["(G) priority G", "G"]);
      lines.push(["(H) priority H", "H"]);
      lines.push(["(I) priority I", "I"]);
      lines.push(["(J) priority J", "J"]);
      lines.push(["(K) priority K", "K"]);
      lines.push(["(L) priority L", "L"]);
      lines.push(["(M) priority M", "M"]);
      lines.push(["(N) priority N", "N"]);
      lines.push(["(O) priority O", "O"]);
      lines.push(["(P) priority P", "P"]);
      lines.push(["(Q) priority Q", "Q"]);
      lines.push(["(R) priority R", "R"]);
      lines.push(["(S) priority S", "S"]);
      lines.push(["(T) priority T", "T"]);
      lines.push(["(U) priority U", "U"]);
      lines.push(["(V) priority V", "V"]);
      lines.push(["(W) priority W", "W"]);
      lines.push(["(X) priority X", "X"]);
      lines.push(["(Y) priority Y", "Y"]);
      lines.push(["(Z) priority Z", "Z"]);
      lines.push(["(a) not a priority", null]);
      lines.push(["(b) not a priority", null]);

      for (let i = 0; i < lines.length; i++) {
        let taskString: string = lines[i][0];
        let expectedPriority: string | null = lines[i][1];

        task = parser.Parse(taskString);
        expect(task.Priority).toEqual(expectedPriority);
      }
    })

    it("can parse projects", () => {
      let task: Task = new Task();
      let lines: Array<[string, Array<string>]> = new Array<[string, Array<string>]>();
      lines.push(["x Download Todo.txt mobile app @Phone +coding +apps +todotxt", [ "coding", "apps", "todotxt" ]]);
      lines.push(["x a completed task starts with an x", []]);
      lines.push(["x 2014-04-22 completion date appears directly after the x.", []]);
      lines.push(["(C) Add cover sheets @Office +TPSReports", [ "TPSReports" ]]);
      lines.push(["Plan backyard herb garden @Home @computer +Garden    +House (more notes)", [ "Garden", "House" ]]);
      lines.push(["(A) x This one has a priority and is not completed", []]);
      lines.push(["x 2013-06-12    2013-07-01  +project1 lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ", [ "project1", "project2", "project3" ]]);

      for (let i = 0; i < lines.length; i++) {
        let taskString: string = lines[i][0];
        let expectedProjects: Array<string> = lines[i][1];

        task = parser.Parse(taskString);
        expect(task.Projects.length === expectedProjects.length).toBe(true);

        for (let j = 0; j < expectedProjects.length; j++) {
          let project: string = expectedProjects[j];
          expect(task.Projects.indexOf(project) >= 0).toBe(true);
        }
      }
    })

    it("can parse contexts", () => {
      let task: Task = new Task();
      let lines: Array<[string, Array<string>]> = new Array<[string, Array<string>]>();
      lines.push(["x Download Todo.txt mobile app @Phone +coding @work  +todotxt", [ "Phone", "work" ]]);
      lines.push(["x a completed task starts with an x", []]);
      lines.push(["x 2014-04-22 completion date appears directly after the x.", []]);
      lines.push(["(C) Add cover sheets @Office +TPSReports", [ "Office" ]]);
      lines.push(["@play  Plan backyard herb garden @Home @computer +Garden    +House (more notes) @work", [ "play", "Home", "computer", "work" ]]);
      lines.push(["(A) x This one has a priority and is not completed", []]);
      lines.push(["x 2013-06-12    2013-07-01  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ", [ "studio", "tommy", "the-cat" ]]);

      for (let i = 0; i < lines.length; i++) {
        let taskString: string = lines[i][0];
        let expectedContexts: Array<string> = lines[i][1];

        task = parser.Parse(taskString);
        expect(task.Contexts.length === expectedContexts.length).toBe(true);

        for (let j = 0; j < expectedContexts.length; j++) {
          let context: string = expectedContexts[j];
          expect(task.Contexts.indexOf(context) >= 0).toBe(true);
        }
      }
    })

    it("can parse properties", () => {
      let task: Task = new Task();
      let lines: Array<[string, Array<Property>]> = new Array<[string, Array<Property>]>();
      lines.push(["x Download Todo.txt mobile app @Phone due:2014-10-15 +coding @work  +todotxt", [ new Property("due", "2014-10-15") ]]);
      lines.push(["x a completed task starts with an x", []]);
      lines.push(["x 2014-04-22 start:2014-07-04 completion date appears directly after the x.", [ new Property("start", "2014-07-04") ]]);
      lines.push(["(C) Add cover sheets @Office +TPSReports notes:add-cover.txt", [ new Property("notes", "add-cover.txt") ] ]);
      lines.push(["@play  Plan backyard herb garden @Home @computer start:2014-07-18 due:2014-08-01 repeat:Weekly +Garden    +House (more notes) @work", [ new Property("start", "2014-07-18"), new Property("due", "2014-08-01"), new Property("repeat", "Weekly") ]]);
      lines.push(["(A) x This one has a priority and is not completed", []]);
      lines.push(["x 2013-06-12    2013-07-01  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ", []]);

      for (let i = 0; i < lines.length; i++) {
        let taskString: string = lines[i][0];
        let expectedProperties: Array<Property> = lines[i][1];

        task = parser.Parse(taskString);
        expect(task.Properties.length === expectedProperties.length).toBe(true);

        for (let j = 0; j < expectedProperties.length; j++) {
          let property: Property = expectedProperties[j];

          let foundIndex: number = _.findIndex(task.Properties, (o) => {
                                                  return _.isEqual(o, property);
                                                });
          expect(foundIndex >= 0).toBe(true);
        }
      }
    })

    it("can parse task text", () => {
      let task: Task = new Task();
      let lines: Array<[string, string]> = new Array<[string, string]>();
      lines.push(["x Download Todo.txt mobile app @Phone due:2014-10-15 +coding @work  +todotxt", "Download Todo.txt mobile app"]);
      lines.push(["x a completed task starts with an x", "a completed task starts with an x"]);
      lines.push(["x 2014-04-22 start:2014-07-04 completion date appears directly after the x.", "completion date appears directly after the x."]);
      lines.push(["(C) Add cover sheets @Office +TPSReports notes:add-cover.txt", "Add cover sheets"]);
      lines.push(["@play  Plan backyard herb garden @Home @computer start:2014-07-18 due:2014-08-01 repeat:Weekly +Garden    +House (more notes) @work", "Plan backyard herb garden    (more notes)"]);
      lines.push(["(A) x This one has a priority and is not completed", "x This one has a priority and is not completed"]);
      lines.push(["x 2013-06-12    2013-07-01  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ", "lots of strange   space in this one"]);

      for (let i = 0; i < lines.length; i++) {
        let taskString: string = lines[i][0];
        let expectedText: string | null = lines[i][1];

        task = parser.Parse(taskString);
        expect(task.Text).toEqual(expectedText);
      }
    })
  });
});

