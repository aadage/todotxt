import {Task} from '../../../../src/core/domain/Task';
import {Property} from '../../../../src/core/domain/Property';
import {TaskSorter} from '../../../../src/core/services/TaskSorter';
import {Constants} from '../../../../src/core/utility/Constants';

describe("TaskSorter", function() {
    describe("Sort()", () => {
        it("sorts by Priority", () => {
            //sorts letter vs letter: A/B
            //sorts letter vs letter: A/A
            //sorts letter vs non-letter: A/null
            //sorts non-letter vs non-letter: null/null

            let sorter = new TaskSorter();
            let tasks: Array<Task> = new Array<Task>();

            let taskA1: Task = new Task();
            taskA1.Priority = 'A';
            taskA1.Text = 'taskA1';

            let taskA2: Task = new Task();
            taskA2.Priority = 'A';
            taskA2.Text = 'taskA2';

            let taskB1: Task = new Task();
            taskB1.Priority = 'B';
            taskB1.Text = 'taskB1';

            let taskC1: Task = new Task();
            taskC1.Priority = 'C';
            taskC1.Text = 'taskC1';

            let taskNull1: Task = new Task();
            taskNull1.Text = 'taskNull1';

            let taskNull2: Task = new Task();
            taskNull2.Text = 'taskNull2';

            tasks.push(taskNull1);
            tasks.push(taskB1);
            tasks.push(taskA1);
            tasks.push(taskC1);
            tasks.push(taskA2);
            tasks.push(taskNull2);

            let sorted = sorter.Sort(tasks, Constants.Priority);

            expect(sorted[0].Text === 'taskA1').toBeTruthy();
            expect(sorted[0].Priority).toBe('A');

            expect(sorted[1].Text === 'taskA2').toBeTruthy();
            expect(sorted[1].Priority).toBe('A');

            expect(sorted[2].Text).toBe('taskB1');
            expect(sorted[2].Priority).toBe('B');

            expect(sorted[3].Text).toBe('taskC1');
            expect(sorted[3].Priority).toBe('C');

            expect(sorted[4].Text === 'taskNull1').toBeTruthy();
            expect(sorted[4].Priority).toBeNull();

            expect(sorted[5].Text === 'taskNull2').toBeTruthy();
            expect(sorted[5].Priority).toBeNull();
        });

        it("sorts by Due Date", () => {
            //sorts higher/lower : 2018-03-25/2018-02-01
            //sorts same/same : 2018-03-25/2018-03-25
            //sorts date/null : 2018-03-25/null
            //sorts null/null : null/null
            //cross month boundary : 2018-03-31/2018-04-01
            //cross year boundary : 2018-01-01/2017-12-31

            let sorter = new TaskSorter();
            let tasks: Array<Task> = new Array<Task>();

            let task1: Task = new Task();
            task1.Properties.push(new Property('due', '2017-12-31'));
            task1.Text = 'task1';

            let task2: Task = new Task();
            task2.Properties.push(new Property('due', '2018-01-01'));
            task2.Text = 'task2';

            let task3: Task = new Task();
            task3.Properties.push(new Property('due', '2018-02-01'));
            task3.Text = 'task3';

            let task4: Task = new Task();
            task4.Properties.push(new Property('due', '2018-03-25'));
            task4.Text = 'task4';

            let task5: Task = new Task();
            task5.Properties.push(new Property('due', '2018-03-25'));
            task5.Text = 'task5';

            let task6: Task = new Task();
            task6.Properties.push(new Property('due', '2018-03-31'));
            task6.Text = 'task6';

            let task7: Task = new Task();
            task7.Properties.push(new Property('due', '2018-04-01'));
            task7.Text = 'task7';

            let task8: Task = new Task();
            task8.Text = 'task8';

            let task9: Task = new Task();
            task9.Text = 'task9';

            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task8);
            tasks.push(task2);
            tasks.push(task6);
            tasks.push(task1);
            tasks.push(task7);
            tasks.push(task9);
            tasks.push(task3);

            let sorted = sorter.Sort(tasks, Constants.DueDate);

            expect(sorted[0].Text).toBe('task1');
            expect(sorted[1].Text).toBe('task2');
            expect(sorted[2].Text).toBe('task3');
            expect(sorted[3].Text === 'task4').toBeTruthy();
            expect(sorted[4].Text === 'task5').toBeTruthy();
            expect(sorted[5].Text).toBe('task6');
            expect(sorted[6].Text).toBe('task7');
            expect(sorted[7].Text === 'task8').toBeTruthy();
            expect(sorted[8].Text === 'task9').toBeTruthy();
        });

        it("sorts by Start Date", () => {
            //sorts higher/lower : 2018-03-25/2018-02-01
            //sorts same/same : 2018-03-25/2018-03-25
            //sorts date/null : 2018-03-25/null
            //sorts null/null : null/null
            //cross month boundary : 2018-03-31/2018-04-01
            //cross year boundary : 2018-01-01/2017-12-31

            let sorter = new TaskSorter();
            let tasks: Array<Task> = new Array<Task>();

            let task1: Task = new Task();
            task1.Properties.push(new Property('t', '2017-12-31'));
            task1.Text = 'task1';

            let task2: Task = new Task();
            task2.Properties.push(new Property('t', '2018-01-01'));
            task2.Text = 'task2';

            let task3: Task = new Task();
            task3.Properties.push(new Property('t', '2018-02-01'));
            task3.Text = 'task3';

            let task4: Task = new Task();
            task4.Properties.push(new Property('t', '2018-03-25'));
            task4.Text = 'task4';

            let task5: Task = new Task();
            task5.Properties.push(new Property('t', '2018-03-25'));
            task5.Text = 'task5';

            let task6: Task = new Task();
            task6.Properties.push(new Property('t', '2018-03-31'));
            task6.Text = 'task6';

            let task7: Task = new Task();
            task7.Properties.push(new Property('t', '2018-04-01'));
            task7.Text = 'task7';

            let task8: Task = new Task();
            task8.Text = 'task8';

            let task9: Task = new Task();
            task9.Text = 'task9';

            tasks.push(task4);
            tasks.push(task5);
            tasks.push(task8);
            tasks.push(task2);
            tasks.push(task6);
            tasks.push(task1);
            tasks.push(task7);
            tasks.push(task9);
            tasks.push(task3);

            let sorted = sorter.Sort(tasks, Constants.StartDate);

            expect(sorted[0].Text).toBe('task1');
            expect(sorted[1].Text).toBe('task2');
            expect(sorted[2].Text).toBe('task3');
            expect(sorted[3].Text === 'task4').toBeTruthy();
            expect(sorted[4].Text === 'task5').toBeTruthy();
            expect(sorted[5].Text).toBe('task6');
            expect(sorted[6].Text).toBe('task7');
            expect(sorted[7].Text === 'task8').toBeTruthy();
            expect(sorted[8].Text === 'task9').toBeTruthy();
        });

        it("secondary sort is in the order of the original array.", () => {
            let sorter = new TaskSorter();
            let tasks: Array<Task> = new Array<Task>();

            let taskA1: Task = new Task();
            taskA1.Priority = 'A';
            taskA1.Text = 'taskA1';

            let taskA2: Task = new Task();
            taskA2.Priority = 'A';
            taskA2.Text = 'taskA2';

            let taskB1: Task = new Task();
            taskB1.Priority = 'B';
            taskB1.Text = 'taskB1';

            let taskB2: Task = new Task();
            taskB2.Priority = 'B';
            taskB2.Text = 'taskB2';

            let taskNull1: Task = new Task();
            taskNull1.Text = 'taskNull1';

            let taskNull2: Task = new Task();
            taskNull2.Text = 'taskNull2';

            tasks.push(taskNull1);
            tasks.push(taskB1);
            tasks.push(taskA1);
            tasks.push(taskB2);
            tasks.push(taskA2);
            tasks.push(taskNull2);

            let sorted = sorter.Sort(tasks, Constants.Priority);

            expect(sorted[0].Text === 'taskA1').toBeTruthy();
            expect(sorted[0].Priority).toBe('A');

            expect(sorted[1].Text === 'taskA2').toBeTruthy();
            expect(sorted[1].Priority).toBe('A');

            expect(sorted[2].Text).toBe('taskB1');
            expect(sorted[2].Priority).toBe('B');

            expect(sorted[3].Text).toBe('taskB2');
            expect(sorted[3].Priority).toBe('B');

            expect(sorted[4].Text === 'taskNull1').toBeTruthy();
            expect(sorted[4].Priority).toBeNull();

            expect(sorted[5].Text === 'taskNull2').toBeTruthy();
            expect(sorted[5].Priority).toBeNull();
        });
    });
});