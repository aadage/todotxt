export interface IConfig {
    //The name of the todo.txt file.
    ToDoFileName: string;

    //The name of the todo.txt backup file.
    ToDoBackupFileName: string;

    //The name of the done.txt file.
    DoneFileName: string;

    //The name of the filter.txt file which contains saved filters.
    FilterFileName: string;

    //The path where the todo.txt file is located.
    ToDoFilePath: string;

    //The number of backup generations to keep
    BackupGenerationCount: number;
}
