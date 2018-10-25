import {Task} from '../domain/Task';

export interface ITaskParser {
    Parse(taskRawText: string): Task;
}