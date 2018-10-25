import {Property} from './Property';

export class Task {
    public Completed: boolean = false;
    public CompletedDate: Date | null = null;
    public CreatedDate: Date | null = null;
    public Priority: string | null = null;
    public Text: string = "";
    public Projects: Array<string> = new Array<string>();
    public Contexts: Array<string> = new Array<string>();
    public Properties: Array<Property> = new Array<Property>();
    public RawText: string = "";

    public equals(task: Task) : boolean {
        if (this.Completed !== task.Completed) return false;
        if (this.CompletedDate !== task.CompletedDate) return false;
        if (this.CreatedDate !== task.CreatedDate) return false;
        if (this.Priority !== task.Priority) return false;
        if (this.Text !== task.Text) return false;
        if (this.RawText !== task.RawText) return false;

        if (this.Projects.length != task.Projects.length) return false;
        for (let i = 0; i < this.Projects.length; i++) {
            let found: boolean = false;
            for (let j = 0; j < task.Projects.length; j++) {
                if (this.Projects[i] === task.Projects[j]) {
                    found = true;
                    break;
                }
            }

            if (!found) return false;
        }

        if (this.Contexts.length != task.Contexts.length) return false;
        for (let i = 0; i < this.Contexts.length; i++) {
            let found: boolean = false;
            for (let j = 0; j < task.Contexts.length; j++) {
                if (this.Contexts[i] === task.Contexts[j]) {
                    found = true;
                    break;
                }
            }

            if (!found) return false;
        }

        if (this.Properties.length != task.Properties.length) return false;
        for (let i = 0; i < this.Properties.length; i++) {
            let found: boolean = false;
            for (let j = 0; j < task.Properties.length; j++) {
                if (this.Properties[i].equals(task.Properties[j])) {
                    found = true;
                    break;
                }
            }

            if (!found) return false;
        }

        return true;
    }
}
