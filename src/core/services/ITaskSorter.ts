import {Task} from '../domain/Task';

export interface ITaskSorter {
    Sort(tasks: Array<Task>, sortBy: string): Array<Task>;
    GetSortOptions(): Array<string>;
}
