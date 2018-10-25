import {ITaskSorter} from './ITaskSorter';
import {Task} from '../domain/Task';
import {DateFn} from '../utility/DateFunctions';
import {ArrayFn} from '../utility/ArrayFunctions';
import {Constants} from '../utility/Constants';

export class TaskSorter implements ITaskSorter {
    Sort(tasks: Array<Task>, sortBy: string): Array<Task>  {
        let sorted: Array<Task> = ArrayFn.Copy(tasks);
        sorted.sort((a: Task, b:Task) => {
            var aVal: number = 0;
            var bVal: number = 0;
            var highVal: number = 'z'.charCodeAt(0) + 1;

            switch(sortBy) {
                case Constants.Priority:
                    aVal = a.Priority === null ? highVal : a.Priority.toLowerCase().charCodeAt(0); 
                    bVal = b.Priority === null ? highVal : b.Priority.toLowerCase().charCodeAt(0); 
                    break;
                case Constants.DueDate:
                    aVal = this.GetDatePropertyValue(a, "due");
                    bVal = this.GetDatePropertyValue(b, "due");
                    break;
                case Constants.StartDate:
                    aVal = this.GetDatePropertyValue(a, "t");
                    bVal = this.GetDatePropertyValue(b, "t");
                    break;
            }

            if (aVal === bVal) {
                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].equals(a)) return -1;
                    if (tasks[i].equals(b)) return 1;
                }
                return 0;
            }
            else {
                return aVal - bVal;
            }
        });

        return sorted;
    }

    GetSortOptions(): string[] {
        return [Constants.Priority, Constants.DueDate, Constants.StartDate];
    }

    private GetDatePropertyValue(task: Task, propertyName: string): number {
        for (let i = 0; i < task.Properties.length; i++) {
            if (task.Properties[i].Name.toLowerCase() === propertyName) {
                let date: Date = DateFn.Parse(task.Properties[i].Value);
                return date.valueOf();
            }
        }

        return this.GetDateHighValue();
    }

    private GetDateHighValue() {
        let date =  new Date(9999, 12, 31, 23, 59, 59, 999);
        return date.valueOf();
    }
}