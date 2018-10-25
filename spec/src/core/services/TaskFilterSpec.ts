import {Task} from '../../../../src/core/domain/Task';
import {TaskFilter} from '../../../../src/core/services/TaskFilter';
import {TaskParser} from '../../../../src/core/services/TaskParser';
import {ArrayFn} from '../../../../src/core/utility/ArrayFunctions';

describe("TaskFilter", function() {
    let parser: TaskParser = new TaskParser();
    //filter rules
    //order of operations is left to right unless explicit parentheses are included
    // example 1:
    //	a and b and c or d
    // is the same as
    //	a and b = result1
    //	result1 and c = result2
    //	result2 or d
    //
    // example 2:
    //	a and b and (c or d)
    // is the same as
    //	c or d = result1
    //	a and b = result2
    //	result2 and result1
    //
    // if nested parentheses are included they are processed from the innermost to the outermost
    // example 3:
    //	a or (b and (c or d))
    // is the same as
    //	c or d = result1
    //	b and result1 = result2
    //	a or result2
    //
    //foo + bar - baz = items that contain the text "foo" and the text "bar" but not "baz"
    //
    //blah OR bar AND foo = items that contain the text "blah" or the text "bar"
    //
    //operators must be separated by spaces
    //e.g. blah + foo = items that contain the text "blah" and the text "foo"
    //     blah+foo = items that contain the text "blah+foo"
    //     blah+ foo  = items that contain the text "blah+ foo"
    //extra spaces are ignored
    //  e.g. blah      + foo = items that contain the text "blah" and the text "foo"
    //
    //blah = items that contain the text "blah"
    //
    //blah + foo = items that contain the text "blah" and the text "foo"
    //blah AND foo
    //blah & foo
    //
    //blah OR bar = items that contain the text "blah" or the text "bar"
    //blah | bar
    //
    //blah - foo = items that contain the text "blah" but not "foo"
    //blah NOT foo

    describe("Filter()", () => {
        let filter: TaskFilter = new TaskFilter();

        it('context filter returns tasks matching context', () => {
            let task1: Task = parser.Parse('x Download Todo.txt mobile app @Phone +coding @work  +todotxt');
            let task2: Task = parser.Parse('x a completed task starts with an x');
            let task3: Task = parser.Parse('x 2014-04-22 completion date appears directly after the x.');
            let task4: Task = parser.Parse('(C) Add cover sheets @Office +TPSReports');
            let task5: Task = parser.Parse('@play  Plan backyard herb garden @Home @computer +Garden    +House (more notes) @work');
            let task6: Task = parser.Parse('(A) x This one has a priority and is not completed');
            let task7: Task = parser.Parse('x 2013-06-12    2013-07-01  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ');
            let task8: Task = parser.Parse('lower case test @phone');

            let tasks = new Array<Task>();
            tasks.push(task1);
            tasks.push(task2);
            tasks.push(task3);
            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task6);
            tasks.push(task7);
            tasks.push(task8);

            let filteredTasks = filter.Filter(tasks, "@work");
            expect(filteredTasks.length).toEqual(2);
            expect(filteredTasks[0].equals(task1)).toBeTruthy();
            expect(filteredTasks[1].equals(task5)).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task5); }) > -1).toBeTruthy();

			//filter is not case sensitive
            filteredTasks = filter.Filter(tasks, "@phone");
            expect(filteredTasks.length).toEqual(2);
            expect(filteredTasks[0].equals(task1)).toBeTruthy();
            expect(filteredTasks[1].equals(task8)).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "@pHoNE");
            expect(filteredTasks.length).toEqual(2);
            expect(filteredTasks[0].equals(task1)).toBeTruthy();
            expect(filteredTasks[1].equals(task8)).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

			//no matches returns empty list
            filteredTasks = filter.Filter(tasks, "@blah");
            expect(filteredTasks.length).toEqual(0);
        });

        it('Filter_ProjectFilter_ReturnsTasksMatchingProject', () => {
            let task1: Task = parser.Parse('x Download Todo.txt mobile app @Phone +coding @work  +todotxt');
            let task2: Task = parser.Parse('x a completed task starts with an x');
            let task3: Task = parser.Parse('x 2014-04-22 completion date appears directly after the x.');
            let task4: Task = parser.Parse('(C) Add cover sheets @Office +TPSReports');
            let task5: Task = parser.Parse('@play  Plan backyard herb garden @Home @computer +Garden    +House (more notes) @work');
            let task6: Task = parser.Parse('(A) x This one has a priority and is not completed');
            let task7: Task = parser.Parse('x 2013-06-12    2013-07-01  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ');
            let task8: Task = parser.Parse('lower case test @phone +Coding');

            let tasks = new Array<Task>();
            tasks.push(task1);
            tasks.push(task2);
            tasks.push(task3);
            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task6);
            tasks.push(task7);
            tasks.push(task8);

            let filteredTasks = filter.Filter(tasks, "+coding");
            expect(filteredTasks.length).toEqual(2);
            expect(filteredTasks[0].equals(task1)).toBeTruthy();
            expect(filteredTasks[1].equals(task8)).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

			//filter is not case sensitive
            filteredTasks = filter.Filter(tasks, "+Coding");
            expect(filteredTasks.length).toEqual(2);
            expect(filteredTasks[0].equals(task1)).toBeTruthy();
            expect(filteredTasks[1].equals(task8)).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "+tpsreports");
            expect(filteredTasks.length).toEqual(1);
            expect(filteredTasks[0].equals(task4)).toBeTruthy();
            //expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task4); }) > -1).toBeTruthy();

			//no matches returns empty list
            filteredTasks = filter.Filter(tasks, "+blah");
            expect(filteredTasks.length).toEqual(0);
        });

        it('Filter_PlainTextFilter_ReturnsMatchingTasks', () => {
            let task1: Task = parser.Parse('x Download Todo.txt mobile app @Phone +coding @work  +todotxt');
            let task2: Task = parser.Parse('x a completed task starts with an x');
            let task3: Task = parser.Parse('x 2014-04-22 completion date appears directly mobile after the x.');
            let task4: Task = parser.Parse('(C) Add cover sheets @Office +TPSReports');
            let task5: Task = parser.Parse('@play  Plan backyard herb garden @Home @computer +Garden    +House (more notes) @work');
            let task6: Task = parser.Parse('(A) x This one has a mobile and is not completed');
            let task7: Task = parser.Parse('x 2013-06-12    2013-07-01 @mobile  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ');
            let task8: Task = parser.Parse('lower case test @phone +Coding');

            let tasks = new Array<Task>();
            tasks.push(task1);
            tasks.push(task2);
            tasks.push(task3);
            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task6);
            tasks.push(task7);
            tasks.push(task8);

            let filteredTasks = filter.Filter(tasks, "mobile");
            expect(filteredTasks.length).toEqual(4);
            expect(filteredTasks[0].equals(task1)).toBeTruthy();
            expect(filteredTasks[1].equals(task3)).toBeTruthy();
            expect(filteredTasks[2].equals(task6)).toBeTruthy();
            expect(filteredTasks[3].equals(task7)).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();


			//filter is not case sensitive
            filteredTasks = filter.Filter(tasks, "MoBile");
            expect(filteredTasks.length).toEqual(4);
            expect(filteredTasks[0].equals(task1)).toBeTruthy();
            expect(filteredTasks[1].equals(task3)).toBeTruthy();
            expect(filteredTasks[2].equals(task6)).toBeTruthy();
            expect(filteredTasks[3].equals(task7)).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();

			//no matches returns empty list
            filteredTasks = filter.Filter(tasks, "blah");
            expect(filteredTasks.length).toEqual(0);
        });

        it('Filter_OneLevel_PARENTHESES', () => {
            let task1: Task = parser.Parse('x Download Todo.txt test mobile app @Phone +coding @work  +todotxt');
            let task2: Task = parser.Parse('x a completed task starts with an x');
            let task3: Task = parser.Parse('x 2014-04-22 completion date appears directly mobile after the x.');
            let task4: Task = parser.Parse('(C) Add cover sheets @Office +TPSReports');
            let task5: Task = parser.Parse('@play  Plan backyard herb garden @Home @computer +Garden    +House (more notes) @work');
            let task6: Task = parser.Parse('(A) x This one has a mobile @phone and is not completed');
            let task7: Task = parser.Parse('x 2013-06-12    2013-07-01 @mobile  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ');
            let task8: Task = parser.Parse('lower case test @phone +Coding +babif');

            let tasks = new Array<Task>();
            tasks.push(task1);
            tasks.push(task2);
            tasks.push(task3);
            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task6);
            tasks.push(task7);
            tasks.push(task8);
			
            //(A and B) or C
            let filteredTasks = filter.Filter(tasks, "(mobile and app) or +babif");
            expect(filteredTasks.length).toEqual(3);
            expect(filteredTasks[0].equals(task1)).toBeTruthy();
            expect(filteredTasks[1].equals(task3)).toBeTruthy();
            expect(filteredTasks[2].equals(task8)).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

			//A or (B and C)
            filteredTasks = filter.Filter(tasks, "case or (@phone and completed)");
            expect(filteredTasks.length).toEqual(2);
            expect(filteredTasks[0].equals(task6)).toBeTruthy();
            expect(filteredTasks[1].equals(task8)).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();
			
			//A or (B and C) or D 
            filteredTasks = filter.Filter(tasks, "case or (@phone + completed) | +garden");
            expect(filteredTasks.length).toEqual(3);
            expect(filteredTasks[0].equals(task5)).toBeTruthy();
            expect(filteredTasks[1].equals(task6)).toBeTruthy();
            expect(filteredTasks[2].equals(task8)).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task5); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();
        });

        it('Filter_Nested_PARENTHESES', () => {
            let task1: Task = parser.Parse('x Download Todo.txt test mobile app @Phone +coding @work  +todotxt');
            let task2: Task = parser.Parse('x a completed task starts with an x');
            let task3: Task = parser.Parse('x 2014-04-22 completion date appears directly mobile after the x.');
            let task4: Task = parser.Parse('(C) Add cover sheets @Office +TPSReports');
            let task5: Task = parser.Parse('@play  Plan backyard herb garden @Home @computer +Garden    +House (more notes) @work');
            let task6: Task = parser.Parse('(A) x This one has a mobile @phone and is not completed');
            let task7: Task = parser.Parse('x 2013-06-12    2013-07-01 @mobile  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ');
            let task8: Task = parser.Parse('lower case test @phone +Coding +babif');

            let tasks = new Array<Task>();
            tasks.push(task1);
            tasks.push(task2);
            tasks.push(task3);
            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task6);
            tasks.push(task7);
            tasks.push(task8);
			
            //(A and (B or C)) not D
            let filteredTasks = filter.Filter(tasks, "(mobile and (@studio or @phone)) not completed");
            expect(filteredTasks.length).toEqual(2);
            expect(filteredTasks[0].equals(task1)).toBeTruthy();
            expect(filteredTasks[1].equals(task7)).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();

            //((A or B) and C) or (D and F)
            filteredTasks = filter.Filter(tasks, "((@studio or @phone) and mobile) or (app and date)");
            expect(filteredTasks.length).toEqual(4);
            expect(filteredTasks[0].equals(task1)).toBeTruthy();
            expect(filteredTasks[1].equals(task3)).toBeTruthy();
            expect(filteredTasks[2].equals(task6)).toBeTruthy();
            expect(filteredTasks[3].equals(task7)).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();


            //include some spaces
            filteredTasks = filter.Filter(tasks, "(  ( @studio or @phone) and mobile   ) or (app and date)");
            expect(filteredTasks.length).toEqual(4);
            expect(filteredTasks[0].equals(task1)).toBeTruthy();
            expect(filteredTasks[1].equals(task3)).toBeTruthy();
            expect(filteredTasks[2].equals(task6)).toBeTruthy();
            expect(filteredTasks[3].equals(task7)).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "(( @studio or @phone) and mobile   ) or ( app and date )");
            expect(filteredTasks.length).toEqual(4);
            expect(filteredTasks[0].equals(task1)).toBeTruthy();
            expect(filteredTasks[1].equals(task3)).toBeTruthy();
            expect(filteredTasks[2].equals(task6)).toBeTruthy();
            expect(filteredTasks[3].equals(task7)).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "(mobile and ( @studio or @phone )) not completed");
            expect(filteredTasks.length).toEqual(2);
            expect(filteredTasks[0].equals(task1)).toBeTruthy();
            expect(filteredTasks[1].equals(task7)).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            // expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();
        });

        it('Filter_ParenthesesWithinFilter', () => {
            let task1: Task = parser.Parse('x Download Todo.txt test mobile app @Phone +coding @work  +todotxt');
            let task2: Task = parser.Parse('x a completed task starts with an x');
            let task3: Task = parser.Parse('x 2014-04-22 completion date appears directly mobile after the x.');
            let task4: Task = parser.Parse('(C) Add cover sheets @Office +TPSReports function()');
            let task5: Task = parser.Parse('@play  Plan backyard (herb garden) @Home @computer  ( stuff ) +Garden    +House (more notes) @work');
            let task6: Task = parser.Parse('(A) x This one has a mobile @phone and is (smith) completed');
            let task7: Task = parser.Parse('x 2013-06-12    2013-07-01 @mobile  @studio () lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ');
            let task8: Task = parser.Parse('lower case ( ) test @phone +Coding +babif');
            let task9: Task = parser.Parse('foo bar blah (multi part text) baz pickle');

            let tasks = new Array<Task>();
            tasks.push(task1);
            tasks.push(task2);
            tasks.push(task3);
            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task6);
            tasks.push(task7);
            tasks.push(task8);
            tasks.push(task9);
			
            //(A)
            let filteredTasks = filter.Filter(tasks, "(A)");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();

            //()
            filteredTasks = filter.Filter(tasks, "()");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task4); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();

            //function()
            filteredTasks = filter.Filter(tasks, "function()");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task4); }) > -1).toBeTruthy();

            //(smith)
            filteredTasks = filter.Filter(tasks, "(smith)");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
			
            //(smith
            filteredTasks = filter.Filter(tasks, "(smith");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
        });

        it('Filter_AND_TwoFilters', () => {
            let task1: Task = parser.Parse('x Download Todo.txt mobile app @Phone +coding @work  +todotxt');
            let task2: Task = parser.Parse('x a completed task starts with an x');
            let task3: Task = parser.Parse('x 2014-04-22 completion date appears directly mobile after the x.');
            let task4: Task = parser.Parse('(C) Add cover sheets @Office +TPSReports');
            let task5: Task = parser.Parse('@play  Plan backyard herb garden @Home @computer +Garden    +House (more notes) @work');
            let task6: Task = parser.Parse('(A) x This one has a mobile @phone and is not completed');
            let task7: Task = parser.Parse('x 2013-06-12    2013-07-01 @mobile  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ');
            let task8: Task = parser.Parse('lower case test @phone +Coding +babif');

            let tasks = new Array<Task>();
            tasks.push(task1);
            tasks.push(task2);
            tasks.push(task3);
            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task6);
            tasks.push(task7);
            tasks.push(task8);

            //plain text and plain text
            let filteredTasks = filter.Filter(tasks, "mobile AND complet");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
			
            filteredTasks = filter.Filter(tasks, "mobile + complet");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "mobile & complet");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();

            //plain text and context
            filteredTasks = filter.Filter(tasks, "mobile and @phone");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "mobile + @phone");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "mobile & @phone");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();

            //plain text and project
            filteredTasks = filter.Filter(tasks, "mobile aND +coding");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "mobile + +coding");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "mobile & +coding");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();

            //context and context
            filteredTasks = filter.Filter(tasks, "@work and @phone");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "@work + @phone");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "@work & @phone");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();

            //context and project
            filteredTasks = filter.Filter(tasks, "@work AND +garden");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task5); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "@work + +garden");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task5); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "@work & +garden");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task5); }) > -1).toBeTruthy();

            //project and project
            filteredTasks = filter.Filter(tasks, "+coding AND +babif");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "+coding + +babif");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "+coding & +babif");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();
        });

        it('Filter_AND_MultipleFilters', () => {
            let task1: Task = parser.Parse('x Download Todo.txt test mobile app @Phone +coding @work  +todotxt');
            let task2: Task = parser.Parse('x a completed task starts with an x');
            let task3: Task = parser.Parse('x 2014-04-22 completion date appears directly mobile after the x.');
            let task4: Task = parser.Parse('(C) Add cover sheets @Office +TPSReports');
            let task5: Task = parser.Parse('@play  Plan backyard herb garden @Home @computer +Garden    +House (more notes) @work');
            let task6: Task = parser.Parse('(A) x This one has a mobile @phone and is not completed');
            let task7: Task = parser.Parse('x 2013-06-12    2013-07-01 @mobile  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ');
            let task8: Task = parser.Parse('lower case test @phone +Coding +babif');
            let task9: Task = parser.Parse('lower case test @home @computer');

            let tasks = new Array<Task>();
            tasks.push(task1);
            tasks.push(task2);
            tasks.push(task3);
            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task6);
            tasks.push(task7);
            tasks.push(task8);
            tasks.push(task9);
			
            //plain text and plain text
            let filteredTasks = filter.Filter(tasks, "mobile AND app + after");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();

			//plain text and context
            filteredTasks = filter.Filter(tasks, "mobile & @phone AND download");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();

            //plain text and project
            filteredTasks = filter.Filter(tasks, "test + +coding & download");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();

            //context and context
            filteredTasks = filter.Filter(tasks, "@home and @computer and @work");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task5); }) > -1).toBeTruthy();

            //context and project
            filteredTasks = filter.Filter(tasks, "@phone AND +coding and mobile");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();

            //project and project
            filteredTasks = filter.Filter(tasks, "@home     and @computer and  @work");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task5); }) > -1).toBeTruthy();

            //multiple results
            filteredTasks = filter.Filter(tasks, "lower and case and test");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task9); }) > -1).toBeTruthy();
        });

        it('Filter_OR_TwoFilters', () => {
            let task1: Task = parser.Parse('x Download Todo.txt mobile app @Phone +coding @work  +todotxt');
            let task2: Task = parser.Parse('x a completed task starts with an x');
            let task3: Task = parser.Parse('x 2014-04-22 completion date appears directly mobile after the x.');
            let task4: Task = parser.Parse('(C) Add cover sheets @Office +TPSReports');
            let task5: Task = parser.Parse('@play  Plan backyard herb garden @Home @computer +Garden    +House (more notes) @work');
            let task6: Task = parser.Parse('(A) x This one has a mobile @phone and is not completed');
            let task7: Task = parser.Parse('x 2013-06-12    2013-07-01 @mobile  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ');
            let task8: Task = parser.Parse('lower case test @phone +Coding +babif');

            let tasks = new Array<Task>();
            tasks.push(task1);
            tasks.push(task2);
            tasks.push(task3);
            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task6);
            tasks.push(task7);
            tasks.push(task8);

            //plain text or plain text
            let filteredTasks = filter.Filter(tasks, "download OR office");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task4); }) > -1).toBeTruthy();
			
            filteredTasks = filter.Filter(tasks, "download | office");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task4); }) > -1).toBeTruthy();

            //plain text or context
            filteredTasks = filter.Filter(tasks, "date or @phone");
            expect(filteredTasks.length).toEqual(4);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "date | @phone");
            expect(filteredTasks.length).toEqual(4);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            //plain text or project
            filteredTasks = filter.Filter(tasks, "mobile Or +babif");
            expect(filteredTasks.length).toEqual(5);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "mobile | +babif");
            expect(filteredTasks.length).toEqual(5);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            //context or context
            filteredTasks = filter.Filter(tasks, "@home or @studio");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task5); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "@home | @studio");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task5); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();

            //context or project
            filteredTasks = filter.Filter(tasks, "@home OR +coding");
            expect(filteredTasks.length).toEqual(3);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task5); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "@home | +coding");
            expect(filteredTasks.length).toEqual(3);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task5); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            //project or project
            filteredTasks = filter.Filter(tasks, "+coding or +tpsreports");
            expect(filteredTasks.length).toEqual(3);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task4); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "+coding | +tpsreports");
            expect(filteredTasks.length).toEqual(3);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task4); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();
        });

        it('Filter_OR_MultipleFilters', () => {
            let task1: Task = parser.Parse('x Download Todo.txt mobile app @Phone +coding @work  +todotxt');
            let task2: Task = parser.Parse('x a completed task starts with an x');
            let task3: Task = parser.Parse('x 2014-04-22 completion date appears directly mobile after the x.');
            let task4: Task = parser.Parse('(C) Add cover sheets @Office +TPSReports');
            let task5: Task = parser.Parse('@play  Plan backyard herb garden @Home @computer +Garden    +House (more notes) @work');
            let task6: Task = parser.Parse('(A) x This one has a mobile @phone and is not completed');
            let task7: Task = parser.Parse('x 2013-06-12    2013-07-01 @mobile  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ');
            let task8: Task = parser.Parse('lower case test @phone +Coding +babif');

            let tasks = new Array<Task>();
            tasks.push(task1);
            tasks.push(task2);
            tasks.push(task3);
            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task6);
            tasks.push(task7);
            tasks.push(task8);

            //plain text or plain text
            let filteredTasks = filter.Filter(tasks, "download OR office or case");
            expect(filteredTasks.length).toEqual(3);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task4); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            //plain text or context
            filteredTasks = filter.Filter(tasks, "date or @phone | @studio");
            expect(filteredTasks.length).toEqual(5);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            //plain text or project
            filteredTasks = filter.Filter(tasks, "mobile Or +babif or +tpsreports");
            expect(filteredTasks.length).toEqual(6);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task4); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            //context or context
            filteredTasks = filter.Filter(tasks, "@home or @studio OR @work");
            expect(filteredTasks.length).toEqual(3);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task5); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();

            //context or project
            filteredTasks = filter.Filter(tasks, "@home OR +coding or @studio");
            expect(filteredTasks.length).toEqual(4);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task5); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            //project or project
            filteredTasks = filter.Filter(tasks, "+coding or +tpsreports or +project2");
            expect(filteredTasks.length).toEqual(4);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task4); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();
        });

        it('Filter_Mixed_AND_OR_NOT_Filters', () => {
            let task1: Task = parser.Parse('x Download Todo.txt mobile app @Phone +coding @work  +todotxt');
            let task2: Task = parser.Parse('x a completed task starts with an x');
            let task3: Task = parser.Parse('x 2014-04-22 completion date appears directly mobile after the x.');
            let task4: Task = parser.Parse('(C) Add cover sheets @Office +TPSReports');
            let task5: Task = parser.Parse('@play  Plan backyard herb garden @Home @computer +Garden    +House (more notes) @work');
            let task6: Task = parser.Parse('(A) x This one has a mobile @phone and is not completed');
            let task7: Task = parser.Parse('x 2013-06-12    2013-07-01 @mobile  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ');
            let task8: Task = parser.Parse('lower case test @phone +Coding +babif');

            let tasks = new Array<Task>();
            tasks.push(task1);
            tasks.push(task2);
            tasks.push(task3);
            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task6);
            tasks.push(task7);
            tasks.push(task8);

            //plain text or plain text
            let filteredTasks = filter.Filter(tasks, "mobile and download or case");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            //plain text or context
            filteredTasks = filter.Filter(tasks, "mobile or test and @phone");
            expect(filteredTasks.length).toEqual(3);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            //plain text or project
            filteredTasks = filter.Filter(tasks, "mobile and +coding or +tpsreports");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task4); }) > -1).toBeTruthy();

            //context or context
            filteredTasks = filter.Filter(tasks, "@home or @studio and @work");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task5); }) > -1).toBeTruthy();

            //context or project
            filteredTasks = filter.Filter(tasks, "@work and +coding or @studio");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();

            //project or project
            filteredTasks = filter.Filter(tasks, "+babif or +todotxt and +coding");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            //mixed and or not
            filteredTasks = filter.Filter(tasks, "mobile or case and @phone not completed");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();
        });

        it('Filter_NOT_TwoFilters', () => {
            let task1: Task = parser.Parse('x Download Todo.txt mobile app @Phone +coding @work  +todotxt');
            let task2: Task = parser.Parse('x a completed task starts with an x');
            let task3: Task = parser.Parse('x 2014-04-22 completion date pears directly mobile after the x.');
            let task4: Task = parser.Parse('(C) Add cover sheets @Office +TPSReports');
            let task5: Task = parser.Parse('@play  Plan backyard herb garden @Home @computer +Garden    +House (more notes) @work');
            let task6: Task = parser.Parse('(A) x This one has a mobile @phone and is not completed');
            let task7: Task = parser.Parse('x 2013-06-12    2013-07-01 @mobile  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ');
            let task8: Task = parser.Parse('lower case test @phone +Coding +babif');

            let tasks = new Array<Task>();
            tasks.push(task1);
            tasks.push(task2);
            tasks.push(task3);
            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task6);
            tasks.push(task7);
            tasks.push(task8);

            //plain text not plain text
            let filteredTasks = filter.Filter(tasks, "mobile NOT app");
            expect(filteredTasks.length).toEqual(3);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();
			
            filteredTasks = filter.Filter(tasks, "mobile - app");
            expect(filteredTasks.length).toEqual(3);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();

            //plain text not context
            filteredTasks = filter.Filter(tasks, "mobile not @phone");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "mobile - @phone");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();

            //plain text not project
            filteredTasks = filter.Filter(tasks, "mobile Not +coding");
            expect(filteredTasks.length).toEqual(3);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "mobile - +coding");
            expect(filteredTasks.length).toEqual(3);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();

            //context not context
            filteredTasks = filter.Filter(tasks, "@phone NOT @work");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "@phone - @work");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            //context not project
            filteredTasks = filter.Filter(tasks, "@phone not +babif");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "@phone - +babif");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();

            //project not project
            filteredTasks = filter.Filter(tasks, "+coding not +babif");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();

            filteredTasks = filter.Filter(tasks, "+coding - +babif");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
        });

        it('Filter_NOT_MultipleFilters', () => {
            let task1: Task = parser.Parse('x Download Todo.txt mobile app @Phone +coding @work  +todotxt');
            let task2: Task = parser.Parse('x a completed task starts with an x');
            let task3: Task = parser.Parse('x 2014-04-22 completion date pears directly mobile after the x.');
            let task4: Task = parser.Parse('(C) Add cover sheets @Office +TPSReports');
            let task5: Task = parser.Parse('@play  Plan backyard herb garden @Home @computer +Garden    +House (more notes) @work');
            let task6: Task = parser.Parse('(A) x This one has a mobile @phone and is not completed');
            let task7: Task = parser.Parse('x 2013-06-12    2013-07-01 @mobile  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ');
            let task8: Task = parser.Parse('lower case test @phone +Coding +babif');

            let tasks = new Array<Task>();
            tasks.push(task1);
            tasks.push(task2);
            tasks.push(task3);
            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task6);
            tasks.push(task7);
            tasks.push(task8);

            //plain text not plain text
            let filteredTasks = filter.Filter(tasks, "mobile NOT app not pears");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();

            //plain text not context
            filteredTasks = filter.Filter(tasks, "mobile not @phone not @studio");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();

            //plain text not project
            filteredTasks = filter.Filter(tasks, "mobile Not +coding not strange");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();

            //context not context
            filteredTasks = filter.Filter(tasks, "@phone NOT @work not +babif");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();

            //context not project
            filteredTasks = filter.Filter(tasks, "@phone not +babif NOT +coding");
            expect(filteredTasks.length).toEqual(1);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();

            //project not project
            filteredTasks = filter.Filter(tasks, "+coding not +babif not @work");
            expect(filteredTasks.length).toEqual(0);
        });

        it('Filter_ExtraWhitespaceIsIgnored', () => {
            let task1: Task = parser.Parse('x Download Todo.txt mobile app @Phone +coding @work  +todotxt');
            let task2: Task = parser.Parse('x a completed task starts with an x');
            let task3: Task = parser.Parse('x 2014-04-22 completion date pears directly mobile after the x.');
            let task4: Task = parser.Parse('(C) Add cover sheets @Office +TPSReports');
            let task5: Task = parser.Parse('@play  Plan backyard herb garden @Home @computer +Garden    +House (more notes) @work');
            let task6: Task = parser.Parse('(A) x This one has a mobile @phone and is not completed');
            let task7: Task = parser.Parse('x 2013-06-12    2013-07-01 @mobile  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ');
            let task8: Task = parser.Parse('lower case test @phone +Coding +babif');

            let tasks = new Array<Task>();
            tasks.push(task1);
            tasks.push(task2);
            tasks.push(task3);
            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task6);
            tasks.push(task7);
            tasks.push(task8);

            //and
            let filteredTasks = filter.Filter(tasks, "@phone and     +coding");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            //or
            filteredTasks = filter.Filter(tasks, "herb      or +babif");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task5); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();

            //not
            filteredTasks = filter.Filter(tasks, "@phone    not      @work");
            expect(filteredTasks.length).toEqual(2);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task6); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task8); }) > -1).toBeTruthy();
        });

        it('Filter_OperatorsMustBeSeparatedBySpaces', () => {
            let task1: Task = new Task();
            task1.RawText = 'x Download Todo.txt mobile app @Phone +coding @work  +todotxt';

            let task2: Task = new Task();
            task2.RawText = 'x a completed task starts with an x';

            let task3: Task = new Task();
            task3.RawText = 'x 2014-04-22 completion date pears directly mobile after the x.';

            let task4: Task = new Task();
            task4.RawText = '(C) Add cover sheets @Office +TPSReports';

            let task5: Task = new Task();
            task5.RawText = '@play  Plan backyard herb garden @Home @computer +Garden    +House (more notes) @work';

            let task6: Task = new Task();
            task6.RawText = '(A) x This one has a mobile @phone and is not completed';

            let task7: Task = new Task();
            task7.RawText = 'x 2013-06-12    2013-07-01 @mobile  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ';

            let task8: Task = new Task();
            task8.RawText = 'lower case test @phone +Coding +babif';


            let tasks = new Array<Task>();
            tasks.push(task1);
            tasks.push(task2);
            tasks.push(task3);
            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task6);
            tasks.push(task7);
            tasks.push(task8);

            //and
            let filteredTasks = filter.Filter(tasks, "@phone+ coding");
            expect(filteredTasks.length).toEqual(0);

            //or
            filteredTasks = filter.Filter(tasks, "herb|babif");
            expect(filteredTasks.length).toEqual(0);
        });

        it('displays completed tasks when CompletedTaskFilterString is provided as a filter string', () => {
            let task1: Task = new Task();
            task1.RawText = 'x Download Todo.txt mobile app @Phone +coding @work  +todotxt';
            task1.Completed = true;

            let task2: Task = new Task();
            task2.RawText = 'x a completed task starts with an x';
            task2.Completed = true;

            let task3: Task = new Task();
            task3.RawText = 'x 2014-04-22 completion date pears directly mobile after the x.';
            task3.Completed = true;

            let task4: Task = new Task();
            task4.RawText = '(C) Add cover sheets @Office +TPSReports';

            let task5: Task = new Task();
            task5.RawText = '@play  Plan backyard herb garden @Home @computer +Garden    +House (more notes) @work';

            let task6: Task = new Task();
            task6.RawText = '(A) x This one has a mobile @phone and is not completed';

            let task7: Task = new Task();
            task7.RawText = 'x 2013-06-12    2013-07-01 @mobile  @studio lots of strange   space in this one +project2   @tommy  @the-cat  +project3 ';
            task7.Completed = true;

            let task8: Task = new Task();
            task8.RawText = 'lower case test @phone +Coding +babif';


            let tasks = new Array<Task>();
            tasks.push(task1);
            tasks.push(task2);
            tasks.push(task3);
            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task6);
            tasks.push(task7);
            tasks.push(task8);

            let filteredTasks = filter.Filter(tasks, filter.CompletedTaskFilterString);
            expect(filteredTasks.length).toEqual(4);
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task1); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task2); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task3); }) > -1).toBeTruthy();
            expect(ArrayFn.IndexWhere(filteredTasks, (t) => { return t.equals(task7); }) > -1).toBeTruthy();
        });
    });
});
