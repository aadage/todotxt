import {Task} from '../domain/Task';

export interface ITaskService {
    GetTasks(): Array<Task>;
    SaveTask(taskRawText: string, originalTask?: Task): void;
    DeleteTasks(tasksRawText: Array<string>): void;
    ArchiveCompletedTasks(): void;
    //SetComplete(taskRawText: string, repeatDate?: Date | null): void;
    SetComplete(taskRawText: string, copyAppendText?: string | null): void;
    SetIncomplete(taskRawText: string): void;
    GetArchivedTasks(year: number): Array<Task>;

    //Returns an array containing the text of the updated tasks.
    AppendText(textToAppend: string, tasksToUpdateRawText: Array<string>): Array<string>;

    //Returns an array containing the text of the updated tasks.
    RemoveText(textToRemove: string, tasksToUpdateRawText: Array<string>): Array<string>;
}
