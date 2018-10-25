import fs = require('fs');
import path = require('path');
import {IFileSystem} from './IFileSystem';
import {DateFn} from '../utility/DateFunctions';

export class FileSystem implements IFileSystem {
    public ReadFile(filename: string): string {
        let fileContents: string = fs.readFileSync(filename, 'utf8');
        return fileContents;
    }

    public WriteFile(filename: string, contents: string): void {
        fs.writeFileSync(filename, contents, 'utf8');
    }

    public DeleteFile(filename: string): void {
        fs.unlinkSync(filename);
    }

    public AppendFile(filename: string, contents: string): void {
        fs.appendFileSync(filename, contents, 'utf8');
    }

    public CopyFile(sourceFilename: string, targetFilename: string): void {
        fs.copyFileSync(sourceFilename, targetFilename);
    }

    public FileExists(filename: string): boolean {
        return fs.existsSync(filename);
    }

    public DirectoryExists(folderPath: string): boolean {
        return fs.existsSync(folderPath);
    }

    public CreateDirectory(path: string): void {
        if (!this.DirectoryExists(path)) {
            fs.mkdirSync(path);
        }
    }

    public DeleteDirectory(directory: string): void {
        let files: Array<string> = this.GetFilenames(directory);

        files.forEach((file) => {
            let fullpath: string = path.join(directory, file);
            if (fs.lstatSync(fullpath).isDirectory()) {
                this.DeleteDirectory(fullpath);
            }
            else {
                this.DeleteFile(fullpath);
            }
        });

        fs.rmdirSync(directory);
    }

    public BackupFile(filename: string, generationsToKeep: number): void {
        if (!this.FileExists(filename)) return;

        let formattedDate: string = DateFn.Format(new Date(), 'yyyy-MM-dd-hh-mm-ss-fff');
        let folderName: string = this.ParseFolderFromFilename(filename);
        let filenameSansPath: string = filename.replace(folderName, '');
        let backupFolderName: string = `${folderName}${path.sep}backups${path.sep}`;
        let backupFilename: string = `${filename.replace(folderName, backupFolderName)}.${formattedDate}`;

        this.EnsureDirectoryExists(backupFolderName);

        while(this.FileExists(backupFilename)) {
            formattedDate = DateFn.Format(new Date(), 'yyyy-MM-dd-hh-mm-ss-fff');
            backupFilename = `${filename.replace(folderName, backupFolderName)}.${formattedDate}`;
        }

        //filename.txt.yyyy-mm-dd-hh-mm-ss-nnn
        //copy the file into a new file with the timestamp name
        this.CopyFile(filename, backupFilename);

        //pull a sorted list of all the files that begin with [filename]
        let folder: string = this.ParseFolderFromFilename(filename);
        //let allFiles: Array<string> = this.GetFilenames(folder);
        let allFiles: Array<string> = this.GetFilenames(backupFolderName);
        let filteredFiles: Array<string> = new Array<string>();

        for (let i = 0; i < allFiles.length; i++) {
            //if the file starts with the filename and ends with the date pattern then add it to the filtered files list.
            let dateExpression: RegExp = /\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{3}/g;
            let fname: string = `${backupFolderName}${allFiles[i]}`;
            let fnameSansPath: string = allFiles[i];

            if (fnameSansPath.indexOf(filenameSansPath) === 0 && fnameSansPath.length > filenameSansPath.length) {
                let datePart: string = fnameSansPath.replace(`${filenameSansPath}.`, '');
                if (dateExpression.test(datePart)) {
                    filteredFiles.push(fname);
                }
            }
        }

        filteredFiles.sort();

        //delete oldest files until we only have [generationsToKeep] files remaining.
        while (filteredFiles.length > generationsToKeep) {
            this.DeleteFile(filteredFiles[0]);
            filteredFiles.splice(0, 1);
        }
    }

    public GetFilenames(folderPath: string): Array<string> {
        let files: Array<string> = new Array<string>();
        fs.readdirSync(folderPath).forEach(file => {
            files.push(file);
        })

        return files;
    }

    /**
     * Receives a filename like c:\temp\filename.txt
     * and returns the folder portion like c:\temp\
     */
    private ParseFolderFromFilename(filename: string): string {
        //find the last backslash and return everything up to that point.
        let endIndex: number = filename.lastIndexOf(path.sep);
        return filename.substring(0, endIndex + 1);
    }

    private EnsureDirectoryExists(directoryName: string): void {
        if (!this.DirectoryExists(directoryName)) {
            this.CreateDirectory(directoryName);
        }
    }

    private OpenFile(filename: string, flags: string): number {
        let failedOnce: boolean = false;

        while (true) {
            try
            {
                let fileDescriptor: number = fs.openSync(filename, flags);
                if (failedOnce) {
                    console.log('SUCCESS!');
                }
                return fileDescriptor;
            }
            catch (err)
            {
                console.log('FileDescriptor Failed');
                console.log(err);
                failedOnce = true;
            }
        }
    }
}
