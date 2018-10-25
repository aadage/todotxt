import {ITaskParser} from './ITaskParser';
import {Task} from '../domain/Task';
import {Property} from '../domain/Property';
import {DateFn} from '../utility/DateFunctions';
import {StrFn} from '../utility/StringFunctions';

export class TaskParser implements ITaskParser {
    //regular expressions
    private get spaceRegex(): RegExp { return /\s/g; }
    private get spacesRegex(): RegExp { return /^\s*$/g; }
    private get dateRegex(): RegExp { return /^\d{4}-\d{2}-\d{2}$/g; }
    private get priorityRegex(): RegExp { return /^\([A-Z]\)$/g; }
    private get propertyRegex(): RegExp { return /.+:.+/; }

    public Parse(taskRawText: string): Task {
        let task: Task = new Task();
        let text: string  = "";
        let tokens: Array<string> = new Array<string>();
        //_completedDateTokenIndex = null;
        //_completedTokenIndex = null;
        //_priorityTokenIndex = null;
        let tokenCount: number = 0;

        task.RawText = taskRawText;

        tokens = taskRawText.split(this.spaceRegex);

        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] == "") {
                text += " ";
            }
            else if (this.spaceRegex.test(tokens[i])) { 
                text += tokens[i];
            }
            else {
                tokenCount += 1;

                //completed flag
                if (tokenCount == 1 && tokens[i] == "x") {
                    task.Completed = true;
                    //_completedTokenIndex = i;
                }
                //completed date
                else if (task.Completed && tokenCount == 2 && this.dateRegex.test(tokens[i])) {
                    task.CompletedDate = DateFn.Parse(tokens[i]);
                    //_completedDate = ParseDate(tokens[i]);
                    //_completedDateTokenIndex = i;
                }
                //created date
                else if (tokenCount == 1 && this.dateRegex.test(tokens[i])) {
                    task.CreatedDate = DateFn.Parse(tokens[i]);
                }
                else if (!StrFn.IsNullOrEmpty(task.Priority) && tokenCount == 2 && this.dateRegex.test(tokens[i])) {
                    task.CreatedDate = DateFn.Parse(tokens[i]);
                }
                else if (task.Completed && task.CompletedDate != null && tokenCount == 3 && this.dateRegex.test(tokens[i])) {
                    task.CreatedDate = DateFn.Parse(tokens[i]);
                }
                //priority
                else if (tokenCount == 1 && this.priorityRegex.test(tokens[i])) {
                    task.Priority = tokens[i].replace("(", "").replace(")", "");
                    task.Priority = task.Priority === "" ? null : task.Priority;
                    //_priorityTokenIndex = i;
                }
                //projects
                else if (tokens[i].substr(0, 1) === "+") {
                    task.Projects.push(tokens[i].substring(1));
                }
                //contexts
                else if (tokens[i].substr(0, 1) === "@") {
                    task.Contexts.push(tokens[i].substring(1));
                }
                //properties
                else if (this.propertyRegex.test(tokens[i])) {
                    let nodes: Array<string> = tokens[i].split(":");
                    task.Properties.push(new Property(nodes[0], nodes[1]));
                }
                else {
                    text += `${tokens[i]} `;
                }
            }
        }

        task.Text = text.trim();
        return task;
    }
}