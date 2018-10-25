import { IConfig } from "../domain/IConfig";

export interface IConfigLoader {
    LoadConfig(): IConfig;
}