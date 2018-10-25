import {IConfig} from './IConfig';

export class Config implements IConfig {
    public ToDoFileName: string = 'todo.txt';
    public ToDoBackupFileName: string = 'todo.backup.txt';
    public DoneFileName: string = 'done.txt';
    public FilterFileName: string = 'filter.txt';
    public ToDoFilePath: string = '';
    public BackupGenerationCount: number = 100;
}