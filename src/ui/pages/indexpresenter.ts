import {Task} from '../../core/domain/Task';
import {IIndexView, TaskUpdate} from './IIndexView';
import { RowClickEvent } from './RowClickEvent';
import { DateFn } from '../../core/utility/DateFunctions';
import { ArrayFn } from '../../core/utility/ArrayFunctions';
import { ITaskService } from '../../core/services/ITaskService';
import { ITaskSorter } from '../../core/services/ITaskSorter';
import { ITaskFilterService } from '../../core/services/ITaskFilterService';
// const {remote} = require('electron')
// const {Menu, MenuItem} = remote

export class IndexPresenter {
    constructor(private view: IIndexView, private taskService: ITaskService, private taskSorter: ITaskSorter, private filterService: ITaskFilterService) {}

    private _tasks: Array<Task> = new Array<Task>();
    private _selectedIndexes: Array<number> = new Array<number>();
    private _filterTimer: NodeJS.Timer | null = null;
    private FILTER_TIMER_PAUSE_LENGTH_MS: number = 250;
    private _displayedTasks: Array<Task> = new Array<Task>();
    private _editedTask: Task | null = null;
    private DEFAULT_FILTER_VALUE: string = '--Filter--';

    public init() {
        this.SetupEventHandlers();
        this._tasks = this.taskService.GetTasks();
        this.loadSortOptions();
        this.loadTasks(true);
        this.loadFilterAndAppendTextOptions();
        //this.addMenuItems();
    }

    // private addMenuItems() {
    //     let _this: IndexPresenter = this;
    //     let menu = Menu.getApplicationMenu();

    //     //loop through the menu items until we find 'View' then append page-specific items
    //     for (let i = 0; i < menu.items.length; i++) {
    //         if (menu.items[i].label === 'View') {
    //             let viewMenu = menu.items[i].submenu;
    //             //menu.items[i].submenu.append(new MenuItem({label: 'MenuItem1', click() { console.log('item 1 clicked') }}));

    //             viewMenu.append(new MenuItem({type: 'separator'}))
    //             viewMenu.append(new MenuItem({label: 'Save Filter', click() { _this.savefilter(); }}));
    //             viewMenu.append(new MenuItem({label: 'Delete Filter', click() { _this.deleteFilter(); }}));
    //             viewMenu.append(new MenuItem({label: 'Archive', click() { _this.archiveCompletedItems(); }}));
    //             viewMenu.append(new MenuItem({label: 'Show Active Items', type: 'checkbox', checked: true, click(menuItem) { 
    //                 console.log(menuItem); 
    //                 //menuItem.checked = !menuItem.checked;
    //             }}))
    //             viewMenu.append(new MenuItem({label: 'Show Completed Items', type: 'checkbox', checked: true}))
    //         }
    //     }
    // }
    
    private SetupEventHandlers(): void {
        let _this: IndexPresenter = this;

        _this.view.filterTextChanged = (filterText: string) => {
            if (_this._filterTimer !== null) {
                clearTimeout(_this._filterTimer);
            }

            _this._filterTimer = setTimeout(() => {
                _this.loadTasks();
            }, _this.FILTER_TIMER_PAUSE_LENGTH_MS);
        };

        _this.view.filterOptionChanged = (filterText: string) => {
            if (filterText === _this.DEFAULT_FILTER_VALUE) {
                filterText = '';
            }

            _this.view.filterText = filterText;
            _this.loadTasks();
        }

        _this.view.windowKeyPressed = (key: string) => {
            if (key === 'Escape') {
                _this.resetFilter();
                _this.loadTasks();
                _this.updateToolbars();
                _this.view.filterTextFocus();
            }
        }

        _this.view.newTaskKeyPressed = (key: string) => {
            if (key === 'Enter') {
                _this.saveNewOrEditedTask();
            }
        }

        _this.view.addTaskButtonClicked = () => {
            //_this.view.hideEditTaskForm();
            _this.clearSelectedTasks();
            //_this.view.showAddTaskForm();
            //_this.hideAllToolbars();
            //_this.view.showTaskEditorToolbar();
            _this.updateToolbars(true);
            _this.view.newTaskFocus();
        }

        _this.view.addTaskCancelButtonClicked = () => {
            _this.hideAddTaskContainer();
        }

        _this.view.addTaskSaveButtonClicked = () => {
            _this.saveNewOrEditedTask();
        }

        _this.view.editTaskButtonClicked = () => {
            //_this.editTask();
            if (_this._selectedIndexes.length === 1) {
                //_this.view.hideEditTaskForm();
                _this._editedTask = _this._displayedTasks[_this._selectedIndexes[0]];
                //_this.view.showAddTaskForm();
                _this.updateToolbars(true);
                _this.view.newTask = _this._editedTask.RawText;
                _this.view.newTaskFocus();
            }
        }

        // _this.view.appendRemoveTextButtonClicked = () => {
        //     alert('implement me!');
        //     // _this.view.hideEditTaskForm();
        //     // _this.view.showAppendRemoveForm();
        //     // _this.view.appendTextFocus();
        // }

        _this.view.appendTextButtonClicked = () => {
            _this.view.showAppendTextPopup();
        }

        _this.view.appendTextOptionSelected = (value: string) => {
            _this.appendRemoveText(value);
            _this.view.hideAppendTextPopup();
            _this.updateToolbars(false);
        }

        _this.view.removeTextButtonClicked = () => {
            _this.loadRemoveTextOptions();
            _this.view.showRemoveTextPopup();
        }

        _this.view.removeTextOptionSelected = (value: string) => {
            _this.appendRemoveText(null, value);
            _this.view.hideRemoveTextPopup();
            _this.updateToolbars(false);
        }

        _this.view.openSetPopupButtonClicked = () => {
            _this.view.showSetCompletePoup();
        }

        _this.view.setCompleteButtonClicked = (repeatDate: string) => {
            let taskUpdates: Array<TaskUpdate> = new Array<TaskUpdate>();
            let currentDate: string = DateFn.Format(new Date());
            let date: Date | null = repeatDate.trim() === "" ? null : DateFn.Parse(repeatDate);
            //let appendText: string = _this.view.setCompleteAppendText.trim();
            //let removeText: string = _this.view.setCompleteRemoveText.trim();

            for (let i = 0; i < _this._selectedIndexes.length; i++) {
                let originalTask: Task = _this._displayedTasks[_this._selectedIndexes[i]];
                let taskRawText: string = originalTask.RawText;

                // if (appendText.length > 0) {
                //     let updatedTasks: Array<string> = _this.taskService.AppendText(appendText, [taskRawText]);
                //     taskRawText = updatedTasks[0];
                //     _this.view.setCompleteAppendText = '';
                // }

                // if (removeText.length > 0) {
                //     let updatedTasks: Array<string> = _this.taskService.RemoveText(removeText, [taskRawText]);
                //     taskRawText = updatedTasks[0];
                //     _this.view.setCompleteRemoveText = '';
                // }

                _this.taskService.SetComplete(taskRawText, date);
            }
            _this._tasks = _this.taskService.GetTasks();
            _this.loadTasks();
            _this.loadFilterAndAppendTextOptions();
            _this.view.filterTextFocus();
            //_this.view.setCompleteRepeatDate = '';
            _this.updateToolbars(false);
        }

        _this.view.appendRemoveSaveButtonClicked = () => {
            alert('implement me');
            // this.view.hideAppendRemoveForm();

            // //let taskUpdates: Array<TaskUpdate> = new Array<TaskUpdate>();
            // let tasksToUpdate: Array<string> = new Array<string>();

            // for (let i = 0; i < this._selectedIndexes.length; i++) {
            //     let taskToUpdate: string = this._displayedTasks[this._selectedIndexes[i]].RawText;
            //     tasksToUpdate.push(taskToUpdate);
            // }

            // let removeText: string = this.view.removeText.trim();
            // let appendText: string = this.view.appendText.trim();

            // if (appendText.length > 0) {
            //     tasksToUpdate = this.taskService.AppendText(appendText, tasksToUpdate);
            // }

            // if (removeText.length > 0) {
            //     this.taskService.RemoveText(removeText, tasksToUpdate);
            // }

            // this._tasks = this.taskService.GetTasks();
            // this.loadTasks();

            // this.view.removeText = '';
            // this.view.appendText = '';
        }

        _this.view.appendRemoveCancelButtonClicked = () => {
            alert('implement me');
            // _this.view.hideAppendRemoveForm();
            // _this.view.appendText = '';
            // _this.view.removeText = '';
        }

        _this.view.deleteTaskButtonClicked = () => {
            let selectedCount: number = _this._selectedIndexes.length;
            let _thisThese: string =  selectedCount === 1 ? '_this' : 'these';
            let s: string = selectedCount === 1 ? '' : 's';
            if (confirm(`Are you sure you want to delete ${_thisThese} ${selectedCount} item${s}?`)) {
                let tasksToDelete: Array<string> = new Array<string>();

                for (let i = 0; i < _this._selectedIndexes.length; i++) {
                    tasksToDelete.push(_this._displayedTasks[_this._selectedIndexes[i]].RawText);
                }
                if (_this.deleteTasks) _this.deleteTasks(tasksToDelete);
            }

            _this.updateToolbars();
        }

        _this.view.sortOptionChanged = (sortOption: string) => {
            _this.loadTasks();
        };

        _this.view.setPriorityOptionChanged = (priorityOption: string) => {
            if (_this.view.setPriorityOption !== 'default') {
                let priority: string = _this.view.setPriorityOption === '' ? '' : `(${_this.view.setPriorityOption}) `;

                let taskUpdates: Array<TaskUpdate> = new Array<TaskUpdate>();

                for (let i = 0; i < _this._selectedIndexes.length; i++) {
                    let originalTask: Task = _this._displayedTasks[_this._selectedIndexes[i]];
                    let newTaskText: string = '';

                    if (originalTask.Priority === null || originalTask.Priority.trim().length === 0) {
                        newTaskText = `${priority}${originalTask.RawText}`;
                    }
                    else {
                        newTaskText = `${priority}${originalTask.RawText.substr(4)}`;
                    }

                    taskUpdates.push(new TaskUpdate(newTaskText, originalTask));
                }
                if (_this.saveTasks) _this.saveTasks(taskUpdates);
                _this.view.setPriorityOption = 'default';
                _this.updateToolbars();
                _this.view.filterTextFocus();
            }
        }

        _this.view.markCompleteButtonClicked = () => {
            let taskUpdates: Array<TaskUpdate> = new Array<TaskUpdate>();
            let currentDate: string = DateFn.Format(new Date());
            let repeatDate: Date | null = _this.view.setCompleteRepeatDate.trim() === "" ? null : DateFn.Parse(_this.view.setCompleteRepeatDate);
            let appendText: string = _this.view.setCompleteAppendText.trim();
            let removeText: string = _this.view.setCompleteRemoveText.trim();

            for (let i = 0; i < _this._selectedIndexes.length; i++) {
                let originalTask: Task = _this._displayedTasks[_this._selectedIndexes[i]];
                let taskRawText: string = originalTask.RawText;

                if (appendText.length > 0) {
                    let updatedTasks: Array<string> = _this.taskService.AppendText(appendText, [taskRawText]);
                    taskRawText = updatedTasks[0];
                    _this.view.setCompleteAppendText = '';
                }

                if (removeText.length > 0) {
                    let updatedTasks: Array<string> = _this.taskService.RemoveText(removeText, [taskRawText]);
                    taskRawText = updatedTasks[0];
                    _this.view.setCompleteRemoveText = '';
                }

                _this.taskService.SetComplete(taskRawText, repeatDate);
            }
            _this._tasks = _this.taskService.GetTasks();
            _this.loadTasks();
            _this.loadFilterAndAppendTextOptions();
            _this.view.filterTextFocus();
            _this.view.setCompleteRepeatDate = '';
        }

        _this.view.markIncompleteButtonClicked = () => {
            let taskUpdates: Array<TaskUpdate> = new Array<TaskUpdate>();

            for (let i = 0; i < _this._selectedIndexes.length; i++) {
                let originalTask: Task = _this._displayedTasks[_this._selectedIndexes[i]];
                _this.taskService.SetIncomplete(originalTask.RawText);
            }
            _this._tasks = _this.taskService.GetTasks();
            _this.loadTasks();
            _this.loadFilterAndAppendTextOptions();
            _this.view.filterTextFocus();
        }

        _this.view.taskRowClicked = (rowClickEvent: RowClickEvent) => {
            _this.selectTask(rowClickEvent);
            _this.updateToolbars();
        };

        _this.view.saveFilterButtonClicked = () => {
            let filter: string = this.view.filterText;
            this.filterService.SaveFilter(filter);
            this.loadFilterAndAppendTextOptions();
        };

        _this.view.deleteFilterButtonClicked = () => {
            let filter: string = this.view.filterText;

            if (confirm(`Are you sure you want to delete the filter: ${filter}?`)) {
                this.filterService.DeleteFilter(filter);
                this.loadFilterAndAppendTextOptions();
            }
        };

        _this.view.showCompletedItemsChanged = () => {
            _this.loadTasks();
        }

        _this.view.showActiveItemsChanged = () => {
            _this.loadTasks();
        }

        _this.view.archiveButtonClicked = () => {
            this.taskService.ArchiveCompletedTasks();
            this._tasks = this.taskService.GetTasks();
            this.loadTasks();
            this.loadFilterAndAppendTextOptions();
        }
    }

    // private editTask(): void {
    //     if (this._selectedIndexes.length === 1) {
    //         //this.view.hideEditTaskForm();
    //         this._editedTask = this._displayedTasks[this._selectedIndexes[0]];
    //         //this.view.showAddTaskForm();
    //         this.view.newTask = this._editedTask.RawText;
    //         this.view.newTaskFocus();
    //     }
    // }

    // private archiveCompletedItems(): void {
    //     this.taskService.ArchiveCompletedTasks();
    //     this._tasks = this.taskService.GetTasks();
    //     this.loadTasks();
    //     this.loadFilterAndAppendTextOptions();
    // }

    // private deleteFilter(): void {
    //     let filter: string = this.view.filterText;

    //     if (confirm(`Are you sure you want to delete the filter: ${filter}?`)) {
    //         this.filterService.DeleteFilter(filter);
    //         this.loadFilterAndAppendTextOptions();
    //     }
    // }

    private loadSortOptions(): void {
        let sortOptions: string[] = this.taskSorter.GetSortOptions();
        this.view.loadSortOptions(sortOptions);
    }

    private loadFilterAndAppendTextOptions(): void {
        let filterOptions: Array<string> = new Array<string>();
        //filterOptions.push(this.filterService.CompletedTaskFilterString);

        //add filter options from task tags
        for (let i = 0; i < this._tasks.length; i++) {
            let task: Task = this._tasks[i];

            for (let c = 0; c < task.Contexts.length; c++) {
                let context = `@${task.Contexts[c]}`;
                if (filterOptions.indexOf(context) === -1) {
                    filterOptions.push(context);
                }
            }

            for (let p = 0; p < task.Projects.length; p++) {
                let project = `+${task.Projects[p]}`;
                if (filterOptions.indexOf(project) === -1) {
                    filterOptions.push(project);
                }
            }
        }

        filterOptions = filterOptions.sort();

        this.view.appendTextOptions = filterOptions.slice();

        filterOptions.splice(0, 0, this.DEFAULT_FILTER_VALUE);

        //add saved filters
        let savedFilters: Array<string> = this.filterService.LoadSavedFilters();
        for (let j = 0; j < savedFilters.length; j++) {
            filterOptions.push(savedFilters[j]);
        }

        this.view.loadFilterOptions(filterOptions);
    }

    private loadRemoveTextOptions(): void {
        //loop through selected tasks and grab all the tags
        let options: Array<string> = new Array<string>();

        for (let i = 0; i < this._selectedIndexes.length; i++) {
            let task: Task = this._displayedTasks[this._selectedIndexes[i]];

            for (let c = 0; c < task.Contexts.length; c++) {
                let context = `@${task.Contexts[c]}`;
                if (options.indexOf(context) === -1) {
                    options.push(context);
                }
            }

            for (let p = 0; p < task.Projects.length; p++) {
                let project = `+${task.Projects[p]}`;
                if (options.indexOf(project) === -1) {
                    options.push(project);
                }
            }
        }

        options.sort();
        this.view.removeTextOptions = options;
    }

    private loadTasks(resetFilter: boolean = false): void {
        if (resetFilter) {
            this.resetFilter();
        }

        //this.view.hideEditTaskForm();
        // this.hideAllToolbars();
        // this.view.showNoItemsSelectedToolbar();

        let filterText: string = this.view.filterText;

        let sorted = this.taskSorter.Sort(this._tasks, this.view.sortOption);
        let tasks: Array<Task> = this.filterService.Filter(sorted, filterText, this.view.showCompletedItems, this.view.showActiveItems);

        this.clearSelectedTasks();

        this.view.loadTasks(tasks);

        this._displayedTasks = tasks;
        this.updateShowingCount();
        //this.updateToolbars();
    }


    private updateToolbars(editingTask: boolean = false): void {
        this.view.hideNoItemsSelectedToolbar();
        this.view.hideItemsSelectedToolbar();
        this.view.hideTaskEditorToolbar();
        this.view.hideAppendTextPopup();
        this.view.hideRemoveTextPopup();

        if (editingTask) {
            this.view.showTaskEditorToolbar();
        }
        else {
            let count: number = this._selectedIndexes.length;
            if (count > 0) {
                //this.view.showEditTaskForm();
                //this.hideAllToolbars();
                this.view.showItemsSelectedToolbar();
            }
            else {
                //this.view.hideEditTaskForm();
                //this.hideAllToolbars();
                this.view.showNoItemsSelectedToolbar();
            }

            if (count === 1) {
                this.view.showEditTaskButton();
            }
            else {
                this.view.hideEditTaskButton();
            }
        }


        // if (this._selectedIndexes.length === 1) {
        //     this.view.showEditTaskButton();
        // }
        // else {
        //     this.view.hideEditTaskButton();
        // }
    }

    // private hideAllToolbars(): void {
    //     this.view.hideNoItemsSelectedToolbar();
    //     this.view.hideItemsSelectedToolbar();
    //     this.view.hideTaskEditorToolbar();
    // }

    private clearSelectedTasks(): void {
        for (let i = 0; i < this._selectedIndexes.length; i++) {
            let index = this._selectedIndexes[i];
            this.view.deSelectTaskRow(index);
        }

        this._selectedIndexes.splice(0, this._selectedIndexes.length);
        //this.view.hideEditTaskForm();
        //this.view.hideAddTaskForm();
        //this.hideAllToolbars();
        //this.view.showNoItemsSelectedToolbar();
        this.updateSelectedCount();
    }

    private selectTask(rowClickEvent: RowClickEvent): void {
        //single select
        if (!rowClickEvent.shiftKey && !rowClickEvent.ctrlKey) {
            this.selectOne(rowClickEvent.index);
        }
        //ctrl-click
        else if (rowClickEvent.ctrlKey && !rowClickEvent.shiftKey) {
            this.ctrlSelect(rowClickEvent.index);
        }
        //shift-click
        else if (rowClickEvent.shiftKey && !rowClickEvent.ctrlKey) {
            this.shiftSelect(rowClickEvent.index);
        }
    }

    private selectOne(index: number): void {
        if (this._selectedIndexes.length === 1 && this._selectedIndexes[0] === index) {
            this.clearSelectedTasks();
        }
        else {
            this.clearSelectedTasks();
            this.selectTaskRowByIndex(index);
        }
    }

    private ctrlSelect(index: number): void {
        for (let i = 0; i < this._selectedIndexes.length; i++) {
            if (this._selectedIndexes[i] === index) {
                this.deSelectTaskRowByIndex(index);
                return;
            }
        }

        this.selectTaskRowByIndex(index);
    }

    private shiftSelect(index: number): void {
        if (this._selectedIndexes.length === 1) {
            //if index is higher count up, if lower count down
            if (index > this._selectedIndexes[0]) {
                for (let i = this._selectedIndexes[0] + 1; i <= index; i++) {
                    this.selectTaskRowByIndex(i);
                }
            }
            else if (index < this._selectedIndexes[0]) {
                for (let i = this._selectedIndexes[0] - 1; i >= index; i--) {
                    this.selectTaskRowByIndex(i);
                }
            }
        }
    }

    private selectTaskRowByIndex(index: number): void {
        //this.hideAddTaskContainer();
        //this.view.showEditTaskForm();
        //this.hideAllToolbars();
        //this.view.showItemsSelectedToolbar();
        this._selectedIndexes.push(index);
        this.view.selectTaskRow(index);

        // if (this._selectedIndexes.length === 1) {
        //     this.view.showEditTaskButton();
        // }
        // else {
        //     this.view.hideEditTaskButton();
        // }

        this.updateSelectedCount();
    }

    private deSelectTaskRowByIndex(index: number): void {
        for (let i = 0; i < this._selectedIndexes.length; i++) {
            if (this._selectedIndexes[i] === index) {
                this._selectedIndexes.splice(i, 1);
                this.view.deSelectTaskRow(index);
                break;
            }
        }

        // let count: number = this._selectedIndexes.length;
        // if (count > 0) {
        //     //this.view.showEditTaskForm();
        //     //this.hideAllToolbars();
        //     this.view.showItemsSelectedToolbar();
        // }
        // else {
        //     //this.view.hideEditTaskForm();
        //     this.hideAllToolbars();
        //     this.view.showNoItemsSelectedToolbar();
        // }

        // if (count === 1) {
        //     this.view.showEditTaskButton();
        // }
        // else {
        //     this.view.hideEditTaskButton();
        // }

        this.updateSelectedCount();
    }

    private hideAddTaskContainer(): void {
        this.view.newTask = '';
        //this.view.hideAddTaskForm();
        // this.hideAllToolbars();
        // this.view.showNoItemsSelectedToolbar();
        this.updateToolbars();
    }

    private updateShowingCount(): void {
        this.view.showingCount =  `${this._displayedTasks.length} items`;
    }

    private updateSelectedCount(): void {
        this.view.selectedCount = `${this._selectedIndexes.length} selected`;
    }

    private resetFilter(): void {
        this.view.filterText = '';
        this.view.filterOption = this.DEFAULT_FILTER_VALUE;
        this.view.filterTextFocus();
    }

    private saveTask(taskRawText: string, originalTask?: Task) {
        this.taskService.SaveTask(taskRawText, originalTask);
        this._tasks = this.taskService.GetTasks();
        this.loadTasks();
        this.loadFilterAndAppendTextOptions();
    }

    private saveNewOrEditedTask() {
        if (this._editedTask !== null) {
            if (this.saveTask) this.saveTask(this.view.newTask, this._editedTask);
            this._editedTask = null;
        }
        else {
            if (this.saveTask) this.saveTask(this.view.newTask);
        }
        this.view.newTask = '';
        //this.view.hideAddTaskForm();
        this.updateToolbars();
    }

    private saveTasks(taskUpdates: Array<TaskUpdate>) {
        try
        {
            for (let i = 0; i < taskUpdates.length; i++) {
                this.taskService.SaveTask(taskUpdates[i].taskRawText, taskUpdates[i].originalTask);
            }
            this._tasks = this.taskService.GetTasks();
            this.loadTasks();
        }
        catch(exception)
        {
            console.log(exception);
        }
    };

    private deleteTasks(tasksRawText: Array<string>) {
        this.taskService.DeleteTasks(tasksRawText);
        this._tasks = this.taskService.GetTasks();
        this.loadTasks();
        this.loadFilterAndAppendTextOptions();
    };

    private appendRemoveText(textToAppend: string | null = null, textToRemove: string | null = null): void {
        let tasksToUpdate: Array<string> = new Array<string>();

        for (let i = 0; i < this._selectedIndexes.length; i++) {
            let taskToUpdate: string = this._displayedTasks[this._selectedIndexes[i]].RawText;
            tasksToUpdate.push(taskToUpdate);
        }

        if (textToAppend !== null && textToAppend.length > 0) {
            tasksToUpdate = this.taskService.AppendText(textToAppend, tasksToUpdate);
        }

        if (textToRemove !== null &&  textToRemove.length > 0) {
            this.taskService.RemoveText(textToRemove, tasksToUpdate);
        }

        this._tasks = this.taskService.GetTasks();
        this.loadTasks();
        this.loadFilterAndAppendTextOptions();
    }
}
