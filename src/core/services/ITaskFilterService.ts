import {Task} from '../domain/Task';

export interface ITaskFilterService {
    Filter(tasks: Array<Task>, filterText: string, showCompletedItems?: boolean, showActiveItems?: boolean): Array<Task>;
    SaveFilter(filterText: string);
    DeleteFilter(filterText: string);
    LoadSavedFilters(): Array<string>;
}