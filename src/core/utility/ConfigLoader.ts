import { IConfig } from "../domain/IConfig";
import { Config } from "../domain/Config";
import { IAppFilenames } from "./IAppFilenames";
import { IConfigLoader } from "./IConfigLoader";
import { IFileSystem } from "./IFileSystem";
import path = require('path');
import process = require('process');
import os = require('os');

export class ConfigLoader implements IConfigLoader {
    constructor(private filenames: IAppFilenames, private fileSystem: IFileSystem) { }

    public LoadConfig(): IConfig {
        let appDataDirectory: string = this.filenames.GetDefaultDataDirectory();
        let configFile: string = `${appDataDirectory}${path.sep}config.json`;
        let config: Config = new Config();

        //look for a config file in the app data directory
        if (this.fileSystem.FileExists(configFile)) {
            let contents: string = this.fileSystem.ReadFile(configFile);
            config  = JSON.parse(contents);
        }
        else {
            //create the default config file
            let username: string = os.userInfo().username;

            if (process.platform === 'win32') {
                config.ToDoFilePath = `C:\\Users\\${username}\\Dropbox\\TODO\\`;
            }
            else {
                //assume linux, will need to update this logic to support other operating systems
                config.ToDoFilePath = `/home/${username}/Dropbox/TODO/`;
            }

            this.fileSystem.WriteFile(configFile, JSON.stringify(config));
        }

        return config;
    }
}
