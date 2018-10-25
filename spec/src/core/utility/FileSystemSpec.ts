import {FileSystem} from '../../../../src/core/utility/FileSystem';
import {ArrayFn} from '../../../../src/core/utility/ArrayFunctions';

describe("FileSystem", function() {
    let fs: FileSystem = new FileSystem();
    let tempFolder: string = 'c:\\temp\\';
    let tempBackupFolder: string = 'c:\\temp\\backups\\';

    describe("BackupFile()", () => {
        it("removes older generations and keeps the indicated number of generations.", () => {
            let filename: string = 'testfile.txt';
            let testFile: string = `${tempFolder}${filename}`;
            CleanupTestFiles(filename);

            fs.WriteFile(testFile, 'test file');

            //let files: Array<string> = fs.GetFilenames(tempFolder);
            let files: Array<string> = fs.GetFilenames(tempBackupFolder);
            let testFiles: Array<string> = ArrayFn.Where(files, (fname) => {
                return fname.indexOf(filename) === 0;
            });

            //expect(testFiles.length).toEqual(1);
            expect(testFiles.length).toEqual(0);

            fs.BackupFile(testFile, 2);

            //files  = fs.GetFilenames(tempFolder);
            files  = fs.GetFilenames(tempBackupFolder);
            testFiles  = ArrayFn.Where(files, (fname) => {
                return fname.indexOf(filename) === 0;
            });

            //expect(testFiles.length).toEqual(2);
            expect(testFiles.length).toEqual(1);

            fs.BackupFile(testFile, 2);

            //files  = fs.GetFilenames(tempFolder);
            files  = fs.GetFilenames(tempBackupFolder);
            testFiles  = ArrayFn.Where(files, (fname) => {
                return fname.indexOf(filename) === 0;
            });

            //expect(testFiles.length).toEqual(3);
            expect(testFiles.length).toEqual(2);

            let oldestFile: string = testFiles[0];

            fs.BackupFile(testFile, 2);

            //files  = fs.GetFilenames(tempFolder);
            files  = fs.GetFilenames(tempBackupFolder);
            testFiles  = ArrayFn.Where(files, (fname) => {
                return fname.indexOf(filename) === 0;
            });

            //expect(testFiles.length).toEqual(3);
            expect(testFiles.length).toEqual(2);

            let removedFiles: Array<string> = ArrayFn.Where(testFiles, (fname) => {
                return fname === oldestFile;
            });

            expect(removedFiles.length).toEqual(0);
        });
    });

    function CleanupTestFiles(filename: string): void {
        let files: Array<string> = fs.GetFilenames(tempFolder);

        for (let i = 0; i < files.length; i++) {
            let file: string = `${tempFolder}${files[i]}`;
            if (file.indexOf(filename) >= 0) {
                fs.DeleteFile(file);
            }
        }

        files = fs.GetFilenames(tempBackupFolder);

        for (let i = 0; i < files.length; i++) {
            let file: string = `${tempBackupFolder}${files[i]}`;
            if (file.indexOf(filename) >= 0) {
                fs.DeleteFile(file);
            }
        }
    }

});
