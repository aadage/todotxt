import fs = require('fs');
import {ITaskFilterService} from './ITaskFilterService';
import {Task} from '../domain/Task';
import {ArrayFn} from '../utility/ArrayFunctions';
import { IConfig } from '../domain/IConfig';

export class TaskFilterService implements ITaskFilterService {
    constructor(private config: IConfig) { }

    private _filterFilename: string = `${this.config.ToDoFilePath}${this.config.FilterFileName}`;

    public Filter(tasks: Array<Task>, filterText: string, showCompletedItems: boolean = true, showActiveItems: boolean = true): Array<Task> {
        try
        {
            //if (filterText.trim() === "") return tasks;

            let tokens: Array<Token> = this.ParseTokens(tasks, filterText);
            let lhs: Array<Task>;
            let rhs: Array<Task>;
            let op: Op;
            let result: Array<Task>;
            let scopeIndexes: Array<number> = new Array<number>(); //treat as a stack
            scopeIndexes.push(-1);

            while (tokens.length > 1)
            {
                //this.DumpTokens(tokens);
                //check for opening or closing parens
                let index: number = scopeIndexes[scopeIndexes.length - 1] + 1;
                let processFilter: boolean = true;
                for (let i = index; i < index + 3 && i < tokens.length; i++)
                {
                    if (tokens[i].OpenParen)
                    {
                        scopeIndexes.push(i);
                        processFilter = false;
                        break;
                    }
                    else if (tokens[i].CloseParen)
                    {
                        scopeIndexes.pop();
                        //tokens.RemoveAt(i);
                        tokens.splice(i, 1);
                        tokens.splice(i - 2, 1);
                        processFilter = false;
                        break;
                    }
                }

                if (processFilter)
                {
                    if (tokens[index + 1].Op !== null)
                    {
                        lhs = tokens[index].ResultSet;
                        op = <Op>tokens[index + 1].Op;
                        rhs = tokens[index + 2].ResultSet;

                        result = this.ProcessOperation(lhs, op, rhs);

                        tokens.splice(index, 3);

                        let newToken = new Token();
                        newToken.ResultSet = result;
                        tokens.splice(index, 0, newToken);
                    }
                    else //filter is not in a valid format, return no matches
                    {
                        return new Array<Task>();
                    }
                }
            }

            //make sure results are in the same order as the original array
            let returnVal: Array<Task> = new Array<Task>();
            for (let i = 0; i < tasks.length; i++) {
                for (let j = 0; j < tokens[0].ResultSet.length; j++) {
                    let originalTask: Task = tasks[i];
                    let resultTask: Task = tokens[0].ResultSet[j];
                    if (resultTask.equals(originalTask)) {
                        if ((showCompletedItems && resultTask.Completed) || (showActiveItems && !resultTask.Completed)) {
                            returnVal.push(resultTask);
                            break;
                        }
                    }
                }
            }

            return returnVal;
        }
        catch
        {
            return new Array<Task>();
        }
    }

    SaveFilter(filterText: string): void {
        if (filterText.trim().length === 0) return;
        let contents: string = '';
        let filterExists: boolean = false;

        //read all the lines of the file.
        let fileExists: boolean = fs.existsSync(this._filterFilename);

        if (fileExists) {
            let fileDescriptor: number = fs.openSync(this._filterFilename,'r');
            let fileContents: string = fs.readFileSync(this._filterFilename, 'utf8');
            fs.closeSync(fileDescriptor);

            let lines: string[] = fileContents.split('\r');

            //look through existing filters to see if the filter being saved already exists
            for (let i = 0; i < lines.length; i++) {
                let line: string = lines[i].trim();
                if (line === filterText) {
                    filterExists = true;
                    break;
                }
            }
        }

        try {
            if (!filterExists) {
                fs.appendFileSync(this._filterFilename, `${filterText}\r\n`);
            }
        }
        catch (err) {
            if (console) console.log(err);
        }
    }

    DeleteFilter(filterText: string) {
        let contents: string = '';

        //read all the lines of the file.
        let fileDescriptor: number = fs.openSync(this._filterFilename,'r');
        let fileContents: string = fs.readFileSync(this._filterFilename, 'utf8');
        fs.closeSync(fileDescriptor);

        let lines: string[] = fileContents.split('\r');

        //if a given line matches the filter being deleted skip it
        for (let i = 0; i < lines.length; i++) {
            let line: string = lines[i].trim();

            if (line.trim() !== filterText.trim()) {
                contents += `${line}\r\n`;
            }
        }

        //write all the lines back to the file
        fileDescriptor = fs.openSync(this._filterFilename,'w');
        fs.writeFileSync(this._filterFilename, contents, 'utf8');
        fs.closeSync(fileDescriptor);
    }

    LoadSavedFilters(): Array<string> {
        let filters: Array<string> = new Array<string>();

        //read all the lines of the file.
        let fileExists: boolean = fs.existsSync(this._filterFilename);

        if (fileExists) {
            let fileDescriptor: number = fs.openSync(this._filterFilename,'r');
            let fileContents: string = fs.readFileSync(this._filterFilename, 'utf8');
            fs.closeSync(fileDescriptor);

            let lines: string[] = fileContents.split('\r');

            for (let i = 0; i < lines.length; i++) {
                let line: string = lines[i].trim();
                
                if (line.length > 0) {
                    filters.push(lines[i].trim());
                }
            }
        }

        return filters;
    }

    private DumpTokens(tokens: Array<Token>): void {
        let sb: string = "";

        for (let i = 0; i < tokens.length; i++)
        {
            if (tokens[i].OpenParen)
                sb += "(";
            else if (tokens[i].CloseParen)
                sb += ")";
            else if (tokens[i].Op !== null)
                sb += tokens[i].Op;
            else if (tokens[i].Filter != null && (<string>tokens[i].Filter).trim() !== "")
                sb += tokens[i].Filter;
            else
                sb += tokens[i].ResultSet.length.toString();

            sb += " ";
        }

        if (console) {
            console.log(sb);
        }
    }

    private ProcessOperation (lhs: Array<Task>, op: Op, rhs: Array<Task>): Array<Task> {
        switch (op)
        {
            case Op.AND:
                return this.Intersect(lhs, rhs);
            case Op.OR:
                return this.Union(lhs, rhs);
            case Op.NOT:
                return this.Except(lhs, rhs);
            default:
                return new Array<Task>();
        }
    }

    private Intersect(lhs: Array<Task>, rhs: Array<Task>): Array<Task> {
        let result: Array<Task> = new Array<Task>();

        for (let i = 0; i < lhs.length; i++) {
            for (let j = 0; j < rhs.length; j++) {
                if (lhs[i].equals(rhs[j])) {
                    if (ArrayFn.IndexWhere(result, (task) => { return task.equals(lhs[i]); }) === -1) {
                        result.push(lhs[i]);
                    }
                } 
            }
        }

        return result;
    }

    private Union(lhs: Array<Task>, rhs: Array<Task>): Array<Task> {
        let result: Array<Task> = new Array<Task>();

        for (let i = 0; i < lhs.length; i++) {
            if (ArrayFn.IndexWhere(result, (task) => { return task.equals(lhs[i]); }) === -1) {
                result.push(lhs[i]);
            }
        }

        for (let i = 0; i < rhs.length; i++) {
            if (ArrayFn.IndexWhere(result, (task) => { return task.equals(rhs[i]); }) === -1) {
                result.push(rhs[i]);
            }
        }

        return result;
    }

    private Except(lhs: Array<Task>, rhs: Array<Task>): Array<Task> {
        let result: Array<Task> = new Array<Task>();

        for (let i = 0; i < lhs.length; i++) {
            let skip: boolean = false;

            for (let j = 0; j < rhs.length; j++) {
                if (lhs[i].equals(rhs[j])) skip = true;
            }

            if (!skip) {
                result.push(lhs[i]);
            }
        }

        return result;
    }

    private RemoveEmpty(array: Array<string>): void {
        for (let i = array.length - 1; i >= 0; i--) {
            if (array[i].trim() === "") {
                array.splice(i, 1);
            }
        }
    }

    private ParseTokens(tasks: Array<Task>, filterText: string): Array<Token> {
        let tokens: Array<Token> = new Array<Token>();
        let tokenStrings: Array<string> = filterText.split(" ");
        this.RemoveEmpty(tokenStrings);

        let op = Op.NULL;

        if (tokenStrings.length === 0) {
            let token = new Token();
            token.Op = Op.NULL;
            token.Filter = filterText;
            token.ResultSet = tasks;
            tokens.push(token);
        }

        //separate parentheses into separate tokens
        for (let i = tokenStrings.length - 1; i >= 0; i--) {
            let tokenString: string = tokenStrings[i].trim();
            if (tokenString.substr(0, 1) === "(" && tokenString.length > 1 && this.IsScopeStart(i, tokenStrings))
            {
                tokenStrings.splice(i, 0, "(");
                tokenStrings[i + 1] = tokenString.substring(1);
                i += 2;  //must reset the index to reprocess the stripped tokenstring which might contain additional parentheses
            }
            else if (tokenString.substr(tokenString.length - 1, 1) === ")" && tokenString.length > 1 && this.IsScopeEnd(i, tokenStrings))
            {
                tokenStrings.splice(i, 0, tokenString.substr(0, tokenString.length - 1));
                tokenStrings[i + 1] = ")";
                i += 1;  //must reset the index to prevent skipping the new tokenString we just inserted
            }
        }

        for (let i = 0; i < tokenStrings.length; i++) {
            let tokenString: string = tokenStrings[i];
            let token: Token | null = null;
            op = this.GetOperator(tokenString);

            if (op == Op.NULL)
            {
                switch (tokenString)
                {
                    case "(":
                        token = new Token();
                        token.OpenParen = true;
                        tokens.push(token);
                        break;
                    case ")":
                        token = new Token();
                        token.CloseParen = true;
                        tokens.push(token);
                        break;
                    default:
                        token = new Token();
                        token.ResultSet = this.SingleFilter(tasks, tokenString);
                        token.Filter = tokenString;
                        tokens.push(token);
                        break;
                }
            }
            else
            {
                token = new Token();
                token.Op = op;
                token.Filter = tokenString;
                tokens.push(token);
            }
        }

        return tokens;
    }

    private IsScopeStart(index: number, tokenStrings: Array<string>): boolean {
        let nestCount: number = 0;

        //if there is a later token that pairs with this one then it's a scope
        for (let i = index + 1; i < tokenStrings.length; i++)
        {
            let tokenString: string = tokenStrings[i];
            for (let c = 0; c < tokenString.length; c++)
            {
                let tsChar: string = tokenString[c];
                if (tsChar == '(')
                {
                    nestCount += 1;
                }
                else if (tsChar == ')')
                {
                    if (nestCount == 0)
                        return true;
                    else
                        nestCount -= 1;
                }

            }
        }

        return false;
    }

    private IsScopeEnd(index: number, tokenStrings: Array<string>): boolean {
        let nestCount: number = 0;

        //if there is an earlier token that pairs with this one then it's a scope
        for (let i = index - 1; i >= 0; i--)
        {
            let tokenString: string = tokenStrings[i];

            for (let c = tokenString.length - 1; c >= 0; c--)
            {
                let tsChar: string = tokenString[c];
                if (tsChar == ')')
                {
                    nestCount += 1;
                }
                else if (tsChar == '(')
                {
                    if (nestCount == 0)
                        return true;
                    else
                        nestCount -= 1;
                }
            }
        }

        return false;
    }

    private SingleFilter(tasks: Array<Task>, filterText: string): Array<Task> {
        if (filterText === null || filterText.length === 0) return tasks;

        var filteredTasks = new Array<Task>();

        switch (filterText.substr(0, 1))
        {
            case "@":
                let context: string = filterText.substring(1);
                for (let i = 0; i < tasks.length; i++) {
                    let task: Task = tasks[i];
                    if (task.Contexts.some((element) => { return element.toLowerCase() === context.toLowerCase(); })) {
                        filteredTasks.push(task);
                    }
                }
                break;
            case "+":
                let project: string = filterText.substring(1);
                for (let i = 0; i < tasks.length; i++) {
                    let task = tasks[i];
                    if (task.Projects.some((element) => { return element.toLowerCase() === project.toLowerCase(); })) {
                        filteredTasks.push(task);
                    }
                }
                break;
            default:
                for (let i = 0; i < tasks.length; i++) {
                    let task = tasks[i];
                    if (task.RawText.toLowerCase().indexOf(filterText.toLowerCase()) > -1) {
                        filteredTasks.push(task);
                    }
                }
                break;
        }

        return filteredTasks;
    }

    private GetOperator(value: string): Op {
        let lcVal: string = value.toLowerCase();
        let op = Op.NULL;

        switch (lcVal)
        {
            case "and":
            case "+":
            case "&":
                return Op.AND;
            case "or":
            case "|":
                return Op.OR;
            case "not":
            case "-":
                return Op.NOT;
        }

        return op;
    }
}

enum Op
{
    AND = "AND",
    OR = "OR",
    NOT = "NOT",
    NULL = "NULL"
}

class Token
{
    public Filter: string | null = null;
    public ResultSet: Array<Task> = new Array<Task>();
    public Op: Op | null = null;
    public OpenParen: boolean = false;
    public CloseParen: boolean = false;
}
