import { IAppFilenames } from "./IAppFilenames";
import path = require('path');
const app = require('electron');

export class AppFilenames implements IAppFilenames {
    public GetDefaultDataDirectory(): string {
        let appdata = process.env.APPDATA;
        return `${appdata}${path.sep}todotxt`;
    }
}
