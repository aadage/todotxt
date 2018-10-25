import { IAppFilenames } from "./IAppFilenames";
import path = require('path');
const app = require('electron');

export class AppFilenames implements IAppFilenames {
    public GetDefaultDataDirectory(): string {
        let appdata = process.env.APPDATA;

        if (process.platform === 'win32') {
            appdata = `${process.env.APPDATA}${path.sep}todotxt`;
        }
        else {
            appdata = `${process.env.HOME}${path.sep}.todotxt`;
        }

        return appdata;
    }
}
