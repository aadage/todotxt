export interface IFileSystem {
    ReadFile(filename: string): string;
    WriteFile(filename: string, contents: string): void;
    DeleteFile(filename: string): void;
    AppendFile(filename: string, contents: string): void;
    CopyFile(sourceFilename: string, targetFilename: string): void;
    FileExists(filename: string): boolean;
    DirectoryExists(path: string): boolean;
    CreateDirectory(path: string): void;
    DeleteDirectory(path: string): void;
    BackupFile(filename: string, generationsToKeep: number): void;
    GetFilenames(folderPath: string): Array<string>;
}
