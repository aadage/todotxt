import * as _ from 'lodash';
import fs = require('fs');
import {Task} from '../../../../src/core/domain/Task';
import {TaskService} from '../../../../src/core/services/TaskService';
import { Config } from '../../../../src/core/domain/Config';
import { DateFn } from '../../../../src/core/utility/DateFunctions';
import { ITaskParser } from '../../../../src/core/services/ITaskParser';
import { TaskParser } from '../../../../src/core/services/TaskParser';
import { ArrayFn } from '../../../../src/core/utility/ArrayFunctions';
import { IFileSystem } from '../../../../src/core/utility/IFileSystem';
import { FileSystem } from '../../../../src/core/utility/FileSystem';

describe("TaskService", function() {
    let config = new Config();
    config.ToDoFileName = 'test.todo.txt';
    config.ToDoBackupFileName = 'test.todo.backup.txt';
    config.DoneFileName = 'test.done.txt';
    let parser: ITaskParser = new TaskParser();
    let fileSystem: IFileSystem = new FileSystem();
    let svc: TaskService = new TaskService(config, parser, fileSystem);

    describe("GetTasks()", () => {
        it("gets all of the tasks from the todo.txt file.", () => {
            let tasks: Array<Task> = svc.GetTasks();
            let taskLengthBefore: number = tasks.length;
            svc.SaveTask('task1');
            svc.SaveTask('task2');
            svc.SaveTask('task3');

            tasks = svc.GetTasks();
            let task1Found = false;
            let task2Found = false;
            let task3Found = false;

            expect(tasks.length).toEqual(taskLengthBefore + 3);

            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].RawText === 'task1') {
                    task1Found = true;
                }

                if (tasks[i].RawText === 'task2') {
                    task2Found = true;
                }

                if (tasks[i].RawText === 'task3') {
                    task3Found = true;
                }
            }

            expect(task1Found).toBeTruthy();
            expect(task2Found).toBeTruthy();
            expect(task3Found).toBeTruthy();

            svc.DeleteTasks(['task1', 'task2', 'task3']);
        });
    });

    describe("SaveTask()", () => {
        it("saves a task to the todo.txt file.", () => {
            let tasks: Array<Task> = svc.GetTasks();
            let taskLengthBefore: number = tasks.length;
            svc.SaveTask('task1');
            svc.SaveTask('task2');
            svc.SaveTask('task3');

            tasks = svc.GetTasks();
            let task1Found = false;
            let task2Found = false;
            let task3Found = false;

            expect(tasks.length).toEqual(taskLengthBefore + 3);

            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].RawText === 'task1') {
                    task1Found = true;
                }

                if (tasks[i].RawText === 'task2') {
                    task2Found = true;
                }

                if (tasks[i].RawText === 'task3') {
                    task3Found = true;
                }
            }

            expect(task1Found).toBeTruthy();
            expect(task2Found).toBeTruthy();
            expect(task3Found).toBeTruthy();

            svc.DeleteTasks(['task1', 'task2', 'task3']);
        });
    });

    describe("DeleteTasks()", () => {
        it("deletes a task from the todo.txt file.", () => {
            let tasks: Array<Task> = svc.GetTasks();
            let taskLengthBefore: number = tasks.length;
            svc.SaveTask('task1');
            svc.SaveTask('task2');
            svc.SaveTask('task3');

            tasks = svc.GetTasks();
            let task1Found = false;
            let task2Found = false;
            let task3Found = false;

            expect(tasks.length).toEqual(taskLengthBefore + 3);

            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].RawText === 'task1') {
                    task1Found = true;
                }

                if (tasks[i].RawText === 'task2') {
                    task2Found = true;
                }

                if (tasks[i].RawText === 'task3') {
                    task3Found = true;
                }
            }

            expect(task1Found).toBeTruthy();
            expect(task2Found).toBeTruthy();
            expect(task3Found).toBeTruthy();

            svc.DeleteTasks(['task1', 'task2', 'task3']);


            tasks = svc.GetTasks();
            task1Found = false;
            task2Found = false;
            task3Found = false;

            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].RawText === 'task1') {
                    task1Found = true;
                }

                if (tasks[i].RawText === 'task2') {
                    task2Found = true;
                }

                if (tasks[i].RawText === 'task3') {
                    task3Found = true;
                }
            }

            expect(task1Found).toBeFalsy();
            expect(task2Found).toBeFalsy();
            expect(task3Found).toBeFalsy();
        });
    });

    describe("ArchiveCompletedTasks()", () => {
        it("moves completed tasks from the todo.txt file to the appropriate year's done.txt file.", () => {
            //delete archive files needed for this test
            let doneFile2015: string = `${config.ToDoFilePath}2015.${config.DoneFileName}`;
            let doneFile2017: string = `${config.ToDoFilePath}2017.${config.DoneFileName}`;
            let doneFile2018: string = `${config.ToDoFilePath}2018.${config.DoneFileName}`;
            if (fs.existsSync(doneFile2015)) { fs.unlinkSync(doneFile2015); }
            if (fs.existsSync(doneFile2017)) { fs.unlinkSync(doneFile2017); }
            if (fs.existsSync(doneFile2018)) { fs.unlinkSync(doneFile2018); }

            //create some completed tasks spanning multiple years
            let task1: string = 'x 2018-03-01 task1';
            let task2: string = 'x 2017-12-31 task2';
            let task3: string = 'x 2018-02-22 task3';
            let task4: string = 'x 2015-02-22 task4';

            svc.SaveTask(task1);
            svc.SaveTask(task2);
            svc.SaveTask(task3);
            svc.SaveTask(task4);

            let tasks: Array<Task> = svc.GetTasks();
            expect(ArrayFn.IndexWhere(tasks, (t) => { return t.RawText === task1}) >= 0).toBeTruthy();
            expect(ArrayFn.IndexWhere(tasks, (t) => { return t.RawText === task2}) >= 0).toBeTruthy();
            expect(ArrayFn.IndexWhere(tasks, (t) => { return t.RawText === task3}) >= 0).toBeTruthy();
            expect(ArrayFn.IndexWhere(tasks, (t) => { return t.RawText === task4}) >= 0).toBeTruthy();

            let archivedTasks: Array<Task> = svc.GetArchivedTasks(2018);
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task1}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task2}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task3}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task4}) >= 0).toBeFalsy();

            archivedTasks = svc.GetArchivedTasks(2017);
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task1}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task2}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task3}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task4}) >= 0).toBeFalsy();

            archivedTasks = svc.GetArchivedTasks(2015);
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task1}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task2}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task3}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task4}) >= 0).toBeFalsy();

            //archive the tasks and verify that they were moved
            svc.ArchiveCompletedTasks();

            tasks = svc.GetTasks();
            expect(ArrayFn.IndexWhere(tasks, (t) => { return t.RawText === task1}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(tasks, (t) => { return t.RawText === task2}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(tasks, (t) => { return t.RawText === task3}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(tasks, (t) => { return t.RawText === task4}) >= 0).toBeFalsy();

            archivedTasks = svc.GetArchivedTasks(2018);
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task1}) >= 0).toBeTruthy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task2}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task3}) >= 0).toBeTruthy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task4}) >= 0).toBeFalsy();

            archivedTasks = svc.GetArchivedTasks(2017);
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task1}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task2}) >= 0).toBeTruthy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task3}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task4}) >= 0).toBeFalsy();

            archivedTasks = svc.GetArchivedTasks(2015);
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task1}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task2}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task3}) >= 0).toBeFalsy();
            expect(ArrayFn.IndexWhere(archivedTasks, (t) => { return t.RawText === task4}) >= 0).toBeTruthy();

            //delete archive files needed for this test
            if (fs.existsSync(doneFile2015)) { fs.unlinkSync(doneFile2015); }
            if (fs.existsSync(doneFile2017)) { fs.unlinkSync(doneFile2017); }
            if (fs.existsSync(doneFile2018)) { fs.unlinkSync(doneFile2018); }
        });
    });

    describe("SetComplete()", () => {
        it("marks a task complete and adds the completed date.", () => {
            svc.SaveTask('task1');
            let currentDate: string = DateFn.Format(new Date());
            let completedTaskText: string = `x ${currentDate} task1`;

            svc.SetComplete('task1');
            let tasks: Array<Task> = svc.GetTasks();
            let task1Found = false;

            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].RawText === completedTaskText) {
                    task1Found = true;
                }
            }

            expect(task1Found).toBeTruthy();

            svc.DeleteTasks([completedTaskText]);
        });

        it("if the task has a priority it is removed.", () => {
            let task: string = '(A) task1';
            let currentDate: string = DateFn.Format(new Date());
            let completedTaskText: string = `x ${currentDate} task1`;
            svc.SaveTask(task);

            svc.SetComplete(task);
            let tasks: Array<Task> = svc.GetTasks();
            let task1Found = false;

            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].RawText === completedTaskText) {
                    task1Found = true;
                }
            }

            expect(task1Found).toBeTruthy();

            svc.DeleteTasks([completedTaskText]);
        });

        it("if the copyAppendText parameter is included marks the current task complete and creates a new task with the given text appended to the new task", () => {
            svc.DeleteTasks(['task1']);
            svc.SaveTask('task1');
            let currentDate: string = DateFn.Format(new Date());
            let repeatDate: Date = new Date(2020, 2, 28);
            let repeatDateString: string = `t:${DateFn.Format(repeatDate)}`;
            let completedTaskText: string = `x ${currentDate} task1`;
            let repeatedTaskText: string = `task1 ${repeatDateString}`;

            svc.SetComplete('task1', repeatDateString);
            let tasks: Array<Task> = svc.GetTasks();
            let completedTaskFound = false;
            let repeatedTaskFound = false;

            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].RawText === completedTaskText) {
                    completedTaskFound = true;
                }
                
                if (tasks[i].RawText === repeatedTaskText) {
                    repeatedTaskFound = true;
                }
            }

            expect(completedTaskFound).toBeTruthy();
            expect(repeatedTaskFound).toBeTruthy();

            svc.DeleteTasks([completedTaskText, repeatedTaskText]);
        });

        it("if the copyAppendText parameter is included and the original task has a priority the priority is removed from the newly created item.", () => {
            svc.DeleteTasks(['(A) task1']);
            svc.SaveTask('(A) task1');
            let currentDate: string = DateFn.Format(new Date());
            let copyAppendText: string = '@friday';
            let completedTaskText: string = `x ${currentDate} task1`;
            let repeatedTaskText: string = `task1 ${copyAppendText}`;

            svc.SetComplete('(A) task1', copyAppendText);
            let tasks: Array<Task> = svc.GetTasks();
            let completedTaskFound = false;
            let repeatedTaskFound = false;

            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].RawText === completedTaskText) {
                    completedTaskFound = true;
                }
                
                if (tasks[i].RawText === repeatedTaskText) {
                    repeatedTaskFound = true;
                }
            }

            expect(completedTaskFound).toBeTruthy();
            expect(repeatedTaskFound).toBeTruthy();

            svc.DeleteTasks([completedTaskText, repeatedTaskText]);
        });

        it("if the repeatDate parameter is included and the original task already has a start (t) date it will be updated.", () => {
            let currentDate: string = DateFn.Format(new Date());
            let repeatDate: Date = new Date(2020, 2, 28);
            let repeatDateString: string = `t:${DateFn.Format(repeatDate)}`;
            let originalTaskText: string = '(A) task1 t:2000-01-01';
            let completedTaskText: string = `x ${currentDate} task1 t:2000-01-01`;
            let repeatedTaskText: string = `task1 ${repeatDateString}`;

            svc.SaveTask(originalTaskText);

            //svc.SetComplete(originalTaskText, repeatDate);
            svc.SetComplete(originalTaskText, repeatDateString);
            let tasks: Array<Task> = svc.GetTasks();
            let completedTaskFound = false;
            let repeatedTaskFound = false;

            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].RawText === completedTaskText) {
                    completedTaskFound = true;
                }
                
                if (tasks[i].RawText === repeatedTaskText) {
                    repeatedTaskFound = true;
                }
            }

            expect(completedTaskFound).toBeTruthy();
            expect(repeatedTaskFound).toBeTruthy();

            svc.DeleteTasks([completedTaskText, repeatedTaskText]);
        });
    });

    describe("SetIncomplete()", () => {
        it("removes the completed task marker and the completed date from a completed task.", () => {
            svc.SaveTask('task1');
            let currentDate: string = DateFn.Format(new Date());
            let completedTaskText: string = `x ${currentDate} task1`;

            svc.SetComplete('task1');
            let tasks: Array<Task> = svc.GetTasks();
            let taskFound = false;
            let completedTaskFound = false;

            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].RawText === 'task1') {
                    taskFound = true;
                }

                if (tasks[i].RawText === completedTaskText) {
                    completedTaskFound = true;
                }
            }

            expect(taskFound).toBeFalsy();
            expect(completedTaskFound).toBeTruthy();

            svc.SetIncomplete(completedTaskText);
            tasks = svc.GetTasks();
            taskFound = false;
            completedTaskFound = false;

            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].RawText === 'task1') {
                    taskFound = true;
                }

                if (tasks[i].RawText === completedTaskText) {
                    completedTaskFound = true;
                }
            }

            expect(taskFound).toBeTruthy();
            expect(completedTaskFound).toBeFalsy();

            svc.DeleteTasks(['task1']);
        });
    });


    describe("AppendText()", () => {
        it("adds the given text to all of the provieded tasks.", () => {
            svc.SaveTask('task1');
            svc.SaveTask('task2');
            let rawTasks: Array<string> = new Array<string>();
            rawTasks.push('task1');
            rawTasks.push('task2');

            let appendedText: string = '@flunsday';
            //let updatedTaskText: string = `task1 ${appendedText}`;

            svc.AppendText(appendedText, rawTasks);
            let tasks: Array<Task> = svc.GetTasks();
            let task1Found = false;
            let task2Found = false;
            let expectedTask1Text: string = `task1 ${appendedText}`;
            let expectedTask2Text: string = `task2 ${appendedText}`;

            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].RawText === expectedTask1Text) {
                    task1Found = true;
                }

                if (tasks[i].RawText === expectedTask2Text) {
                    task2Found = true;
                }
            }

            expect(task1Found).toBeTruthy();
            expect(task2Found).toBeTruthy();

            svc.DeleteTasks([expectedTask1Text, expectedTask2Text]);
        });

        it("returns the updated tasks.", () => {
            svc.SaveTask('task1');
            svc.SaveTask('task2');
            let rawTasks: Array<string> = new Array<string>();
            rawTasks.push('task1');
            rawTasks.push('task2');

            let appendedText: string = '@flunsday';

            let updatedTasks: Array<string> = svc.AppendText(appendedText, rawTasks);

            let task1Found = false;
            let task2Found = false;
            let expectedTask1Text: string = `task1 ${appendedText}`;
            let expectedTask2Text: string = `task2 ${appendedText}`;

            for (let i = 0; i < updatedTasks.length; i++) {
                if (updatedTasks[i] === expectedTask1Text) {
                    task1Found = true;
                }

                if (updatedTasks[i] === expectedTask2Text) {
                    task2Found = true;
                }
            }

            expect(task1Found).toBeTruthy();
            expect(task2Found).toBeTruthy();

            svc.DeleteTasks([expectedTask1Text, expectedTask2Text]);
        });
    });

    describe("RemoveText()", () => {
        it("removes the given text from all of the provieded tasks.", () => {
            svc.DeleteTasks(['task1', 'task2']);
            let appendedText: string = '@flunsday';
            let task1: string = `task1 ${appendedText}`;
            let task2: string = `task2 ${appendedText}`;
            svc.SaveTask(task1);
            svc.SaveTask(task2);
            let rawTasks: Array<string> = new Array<string>();
            rawTasks.push(task1);
            rawTasks.push(task2);

            svc.RemoveText(appendedText, rawTasks);
            let tasks: Array<Task> = svc.GetTasks();
            let task1Found = false;
            let task2Found = false;
            let expectedTask1Text: string = `task1`;
            let expectedTask2Text: string = `task2`;

            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].RawText === expectedTask1Text) {
                    task1Found = true;
                }

                if (tasks[i].RawText === expectedTask2Text) {
                    task2Found = true;
                }
            }

            expect(task1Found).toBeTruthy();
            expect(task2Found).toBeTruthy();

            svc.DeleteTasks([expectedTask1Text, expectedTask2Text]);
        });

        it("returns updated tasks", () => {
            svc.DeleteTasks(['task1', 'task2']);
            let appendedText: string = '@flunsday';
            let task1: string = `task1 ${appendedText}`;
            let task2: string = `task2 ${appendedText}`;
            svc.SaveTask(task1);
            svc.SaveTask(task2);
            let rawTasks: Array<string> = new Array<string>();
            rawTasks.push(task1);
            rawTasks.push(task2);

            let updatedTasks: Array<string> = svc.RemoveText(appendedText, rawTasks);
            let task1Found = false;
            let task2Found = false;
            let expectedTask1Text: string = `task1`;
            let expectedTask2Text: string = `task2`;

            for (let i = 0; i < updatedTasks.length; i++) {
                if (updatedTasks[i] === expectedTask1Text) {
                    task1Found = true;
                }

                if (updatedTasks[i] === expectedTask2Text) {
                    task2Found = true;
                }
            }

            expect(task1Found).toBeTruthy();
            expect(task2Found).toBeTruthy();

            svc.DeleteTasks([expectedTask1Text, expectedTask2Text]);
        });
    });
});

