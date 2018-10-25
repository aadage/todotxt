import {Task} from '../domain/Task';

export interface ITaskFilter {
    CompletedTaskFilterString: string;
    Filter(tasks: Array<Task>, filterText: string): Array<Task>;
}