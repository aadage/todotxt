import {ITaskService} from './ITaskService';
import {IConfig} from '../domain/IConfig';
import {Task} from '../domain/Task';
import { ITaskParser } from './ITaskParser';
import { DateFn } from '../utility/DateFunctions';
import { IFileSystem } from '../utility/IFileSystem';

export class TaskService implements ITaskService {
    private _filename: string;
    private _generationCount: number;
    private get startDateRegEx(): RegExp { return /\st:\d{4}-\d{2}-\d{2}/g; }

    constructor(private config: IConfig, private parser: ITaskParser, private fileSystem: IFileSystem) { 
        this._filename = config.ToDoFilePath + config.ToDoFileName;
        this._generationCount = config.BackupGenerationCount;
    }

    public GetTasks(): Array<Task> {
        return this.GetTasksFromFile(this._filename);
    }

    private GetTasksFromFile(filename: string): Array<Task> {
        let tasks: Array<Task> = new Array<Task>();

        if (this.fileSystem.FileExists(filename)) {
            let fileContents: string = this.fileSystem.ReadFile(filename);

            let lines: string[] = fileContents.split('\r');

            for (let i = 0; i < lines.length; i++) {
                let line: string = lines[i].trim();

                let task: Task = this.parser.Parse(line);
                if (task.Text.trim() !== '') {
                    tasks.push(task);
                }
            }
        }

        return tasks;
    }

    public SaveTask(taskRawText: string, originalTask?: Task): void {
        return this.SaveTaskToFile(this._filename, taskRawText, originalTask);
    }

    private SaveTaskToFile(filename: string, taskRawText: string, originalTask?: Task): void {
        this.fileSystem.BackupFile(filename, this._generationCount);

        if (originalTask) {
            let contents: string = '';

            if (this.fileSystem.FileExists(filename)) {
                //read all the lines of the file.
                let fileContents: string = this.fileSystem.ReadFile(filename);

                let lines: string[] = fileContents.split('\r');

                //if a given line matches the raw text of the original task, replace it with the new raw text
                for (let i = 0; i < lines.length; i++) {
                    let line: string = lines[i].trim();
                    if (line === originalTask.RawText) {
                        line = taskRawText;
                    }

                    if (line.length > 0) {
                        contents += `${line}\r\n`;
                    }
                }
            }

            //write all the lines back to the file
            this.fileSystem.WriteFile(filename, contents);
        }
        else {
            this.fileSystem.AppendFile(filename, `\r\n${taskRawText}`);
            this.RemoveBlankLines(filename);
        }
    }

    public DeleteTasks(tasksRawText: Array<string>): void {
        return this.DeleteTasksFromFile(this._filename, tasksRawText);
    }

    private DeleteTasksFromFile(filename: string, tasksRawText: Array<string>): void {
        this.fileSystem.BackupFile(filename, this._generationCount);

        let contents: string = '';

        if (this.fileSystem.FileExists(filename)) {
            //read all the lines of the file.
            let fileContents: string = this.fileSystem.ReadFile(filename);

            let lines: string[] = fileContents.split('\r');

            //if a given line matches the raw text of any of the lines being deleted skip it
            for (let i = 0; i < lines.length; i++) {
                let line: string = lines[i].trim();

                for (let j = 0; j < tasksRawText.length; j++) {
                    if (line === tasksRawText[j]) {
                        line = '';
                        break;
                    }
                }

                if (line.length > 0) {
                    contents += `${line}\r\n`;
                }
            }

            //write all the lines back to the file
            this.fileSystem.WriteFile(filename, contents);
        }
    }

    public SetComplete(taskRawText: string, copyAppendText: string | null = null): void {
        let currentDate: string = DateFn.Format(new Date());
        let originalTask: Task = this.parser.Parse(taskRawText);
        let newTaskRawText: string;

        if (originalTask.Priority !== null) {
            newTaskRawText = `x ${currentDate} ${taskRawText.substr(4)}`;
        }
        else {
            newTaskRawText = `x ${currentDate} ${taskRawText}`;
        }


        if (!originalTask.Completed) {
            this.SaveTask(newTaskRawText, originalTask);

            if (copyAppendText !== null && copyAppendText.trim().length > 0) {

                //let repeatDateString: string = DateFn.Format(<Date>repeatDate);

                if (this.startDateRegEx.test(copyAppendText)) {
                    newTaskRawText = taskRawText.replace(this.startDateRegEx, '');
                }
                else {
                    newTaskRawText = taskRawText;
                }

                if (originalTask.Priority !== null) {
                    newTaskRawText = `${newTaskRawText.substr(4)}`;
                }
                
                newTaskRawText = `${newTaskRawText} ${copyAppendText}`;

                this.SaveTask(newTaskRawText);
            }
        }
    }

    // public SetComplete(taskRawText: string, repeatDate: Date | null = null): void {
    //     let currentDate: string = DateFn.Format(new Date());
    //     let originalTask: Task = this.parser.Parse(taskRawText);
    //     let newTaskRawText: string;

    //     if (originalTask.Priority !== null) {
    //         newTaskRawText = `x ${currentDate} ${taskRawText.substr(4)}`;
    //     }
    //     else {
    //         newTaskRawText = `x ${currentDate} ${taskRawText}`;
    //     }


    //     if (!originalTask.Completed) {
    //         this.SaveTask(newTaskRawText, originalTask);

    //         if (repeatDate !== null) {

    //             let repeatDateString: string = DateFn.Format(<Date>repeatDate);

    //             newTaskRawText = taskRawText.replace(this.startDateRegEx, '');

    //             if (originalTask.Priority !== null) {
    //                 newTaskRawText = `${newTaskRawText.substr(4)}`;
    //             }
                
    //             newTaskRawText = `${newTaskRawText} t:${repeatDateString}`;

    //             this.SaveTask(newTaskRawText);
    //         }
    //     }
    // }

    public SetIncomplete(taskRawText: string): void {
        let newTaskRawText: string = taskRawText.substring(13);
        let originalTask: Task = this.parser.Parse(taskRawText);

        if (originalTask.Completed) {
            this.SaveTask(newTaskRawText, originalTask);
        }
    }

    public ArchiveCompletedTasks(): void {
        //get all current tasks
        let tasks: Array<Task> = this.GetTasks();
        let tasksToDelete: Array<string> = new Array<string>();

        //loop through them and find completed tasks
        for (let i = 0; i < tasks.length; i++) {
            let task: Task = tasks[i];
            
            if (task.Completed) {
                //for each completed task add it to it's year-named done.txt file and remove it from the todo.txt file
                let doneFilename: string = this.GetDoneFileName((<Date>task.CompletedDate).getFullYear());
                this.SaveTaskToFile(doneFilename, task.RawText);
                this.RemoveBlankLines(doneFilename);
                tasksToDelete.push(task.RawText);
            }
        }

        this.DeleteTasks(tasksToDelete);
    }

    public GetArchivedTasks(year: number): Array<Task> {
        let filename: string = this.GetDoneFileName(year);
        return this.GetTasksFromFile(filename);
    }

    public AppendText(textToAppend: string, tasksToUpdateRawText: Array<string>): Array<string> {
        let originalTask: Task;
        let updatedTasks: Array<string> = new Array<string>();

        for (let i = 0; i < tasksToUpdateRawText.length; i++) {
            originalTask = this.parser.Parse(tasksToUpdateRawText[i]);
            let newTaskText: string = tasksToUpdateRawText[i];

            if (textToAppend.length > 0) {
                newTaskText = `${newTaskText} ${textToAppend}`;
                this.SaveTask(newTaskText, originalTask);
                updatedTasks.push(newTaskText);
            }
        }

        return updatedTasks;
    }

    public RemoveText(textToRemove: string, tasksToUpdateRawText: Array<string>): Array<string> {
        let originalTask: Task;
        let updatedTasks: Array<string> = new Array<string>();

        for (let i = 0; i < tasksToUpdateRawText.length; i++) {
            originalTask = this.parser.Parse(tasksToUpdateRawText[i]);
            let newTaskText: string = tasksToUpdateRawText[i];

            if (textToRemove.length > 0) {
                newTaskText = newTaskText.replace(textToRemove, '').trim();
                this.SaveTask(newTaskText, originalTask);
                updatedTasks.push(newTaskText);
            }
        }

        return updatedTasks;
    }

    private GetDoneFileName(year: number): string {
        return `${this.config.ToDoFilePath}${year.toString()}.${this.config.DoneFileName}`;
    }

    private RemoveBlankLines(filename: string): void {
        let blankFound: boolean = false;
        let fileContents: string = this.fileSystem.ReadFile(filename);

        let lines: string[] = fileContents.split('\r');

        for (let i = 0; i < lines.length; i++) {
            let line: string = lines[i].trim();

            if (line.length === 0) blankFound = true;
        }

        if (blankFound) {
            let contents: string = '';

            for (let i = 0; i < lines.length; i++) {
                let line: string = lines[i].trim();
                if (line.length > 0) {
                    contents += `${line}\r\n`;
                }
            }

            this.fileSystem.BackupFile(filename, this._generationCount);
            this.fileSystem.WriteFile(filename, contents);
        }
    }
}