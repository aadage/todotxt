import {Task} from '../../core/domain/Task';
import {IIndexView} from './IIndexView';
import {RowClickEvent} from './RowClickEvent';
import { BADHINTS } from 'dns';
import { Popup, PopupOptions, PopupBoxPosition } from '../components/Popup/Popup';
const {remote} = require('electron')
const {Menu, MenuItem} = remote

export class IndexView implements IIndexView {
    private popup: Popup = new Popup();

    constructor() {
        //capture element references
        this.sortOptionsSelectElement = <HTMLSelectElement>document.getElementById('sort-options');
        this.filterSelectElement = <HTMLSelectElement>document.getElementById('filter-select');
        this.filterBoxElement = <HTMLInputElement>document.getElementById('filter');
        this.newTaskElement = <HTMLTextAreaElement>document.getElementById('new-task');
        this.addTaskButton = <HTMLButtonElement>document.getElementById('add-task');
        this.addTaskCancelButton = <HTMLButtonElement>document.getElementById('add-task-cancel');
        this.addTaskSaveButton = <HTMLButtonElement>document.getElementById('add-task-save');
        this.editTaskButton = <HTMLButtonElement>document.getElementById('edit-task');
        this.deleteTaskButton = <HTMLButtonElement>document.getElementById('delete-task');
        this.appendTextButton = <HTMLButtonElement>document.getElementById('append-text');
        this.removeTextButton = <HTMLButtonElement>document.getElementById('remove-text');
        this.openSetPopupButton = <HTMLButtonElement>document.getElementById('open-set-popup');
        this.setPriorityElement = <HTMLSelectElement>document.getElementById('set-priority');
        this.taskContainer = <HTMLDivElement>document.getElementById('task-container');
        this.selectedCountElement = <HTMLSpanElement>document.getElementById('selected-count');
        this.noItemsSelectedToolbar = <HTMLDivElement>document.getElementById('toolbar-no-selection');
        this.itemsSelectedToolbar = <HTMLDivElement>document.getElementById('toolbar-items-selected');
        this.taskEditorToolbar = <HTMLDivElement>document.getElementById('toolbar-task-editor');

        this.addMenuItems();
        this.setupEventHandlers();
    }

    //elements
    sortOptionsSelectElement: HTMLSelectElement;
    filterSelectElement: HTMLSelectElement;
    filterBoxElement: HTMLInputElement;
    newTaskElement: HTMLTextAreaElement;
    addTaskButton: HTMLButtonElement;
    addTaskCancelButton: HTMLButtonElement;
    addTaskSaveButton: HTMLButtonElement;
    editTaskButton: HTMLButtonElement;
    deleteTaskButton: HTMLButtonElement;
    appendTextButton: HTMLButtonElement;
    removeTextButton: HTMLButtonElement;
    openSetPopupButton: HTMLButtonElement;
    setPriorityElement: HTMLSelectElement;
    taskContainer: HTMLDivElement;
    selectedCountElement: HTMLSpanElement;
    noItemsSelectedToolbar: HTMLDivElement;
    itemsSelectedToolbar: HTMLDivElement;
    taskEditorToolbar: HTMLDivElement;

    //sortOption
    get sortOption(): string {
        return this.sortOptionsSelectElement.value;
    }

    //filterText
    get filterText(): string {
        return this.filterBoxElement.value;
    }
    set filterText(value: string) {
        this.filterBoxElement.value = value;
    }

    //filterOption
    get filterOption(): string {
        return this.filterSelectElement.value;
    }
    set filterOption(value: string) {
        this.filterSelectElement.value = value;
    }

    //setPriorityOption
    get setPriorityOption(): string {
        return this.setPriorityElement.value;
    }
    set setPriorityOption(value: string) {
        this.setPriorityElement.value = value;
    }

    //newTask
    get newTask(): string {
        return this.newTaskElement.value;
    }
    set newTask(value: string) {
        this.newTaskElement.value = value;
    }

    //removeText
    get removeText(): string {
        //return this.removeTextBox.value;
        return '';
    }
    set removeText(value: string) {
        //this.removeTextBox.value = value;
    }

    private _removetextOptions: Array<string> | null = null;
    set removeTextOptions(value: Array<string>) {
        this._removetextOptions = value;
    }

    //appendText
    get appendText(): string {
        //return this.appendTextBox.value;
        return '';
    }
    set appendText(value: string) {
        //this.appendTextBox.value = value;
    }

    private _appendtextOptions: Array<string> | null = null;
    set appendTextOptions(value: Array<string>) {
        this._appendtextOptions = value;
    }

    //showingCount
    set showingCount(value: string) {
        let elements: HTMLCollectionOf<Element> = document.getElementsByClassName('showing-count');
        for (let i = 0; i < elements.length; i++) {
            elements[i].innerHTML = value;
        }
    }

    //selectedCount
    set selectedCount(value: string) {
        this.selectedCountElement.innerHTML = value;
    }


    //showCompletedItems
    private _showCompletedItems: boolean = true;
    get showCompletedItems(): boolean {
        return this._showCompletedItems;
    }
     
    //showActiveItems
    private _showActiveItems: boolean = true;
    get showActiveItems(): boolean {
        return this._showActiveItems;
    }

    //setCompelteRepeatDate
    get setCompleteRepeatDate(): string {
        //return this.setCompleteRepeatDateTextBox.value;
        return '';
    }
    set setCompleteRepeatDate(value: string) {
        //this.setCompleteRepeatDateTextBox.value = value;
    }

    //setCompleteRemoveText
    get setCompleteRemoveText(): string {
        //return this.setCompleteRemoveTextBox.value;
        return '';
    }
    set setCompleteRemoveText(value: string) {
        //this.setCompleteRemoveTextBox.value = value;
    }
    //setCompleteAppendText
    get setCompleteAppendText(): string {
        //return this.setCompleteAppendTextBox.value;
        return '';
    }
    set setCompleteAppendText(value: string) {
        //this.setCompleteAppendTextBox.value = value;
    }

    //event callbacks
    sortOptionChanged?: (sortOption: string) => void;
    filterTextChanged?: (filterOption: string) => void;
    filterOptionChanged?: (filterText: string) => void;
    taskRowClicked?: (clickEvent: RowClickEvent) => void;
    windowKeyPressed?: (key: string) => void;
    newTaskKeyPressed?: (key: string) => void;
    addTaskButtonClicked?: () => void;
    addTaskCancelButtonClicked?: () => void;
    addTaskSaveButtonClicked?: () => void;
    editTaskButtonClicked?: () => void;
    appendTextButtonClicked?: () => void;
    appendTextOptionSelected?: (textToAppend: string) => void;
    removeTextButtonClicked?: () => void;
    removeTextOptionSelected?: (textToRemove: string) => void;
    openSetPopupButtonClicked?: () => void;
    setCompleteButtonClicked?: (copyAppendText: string) => void;
    appendRemoveSaveButtonClicked?: () => void;
    appendRemoveCancelButtonClicked?: () => void;
    deleteTaskButtonClicked?: () => void;
    setPriorityOptionChanged?: (priorityOption: string) => void;
    //markCompleteButtonClicked?: () => void;
    markIncompleteButtonClicked?: () => void;
    saveFilterButtonClicked?: () => void;
    deleteFilterButtonClicked?: () => void;
    showCompletedItemsChanged?: () => void;
    showActiveItemsChanged?: () => void;
    archiveButtonClicked?: () => void;


    loadFilterOptions(filterOptions: Array<string>): void {
        while (this.filterSelectElement.options.length > 0) {
            this.filterSelectElement.remove(0);
        }

        for (let i = 0; i < filterOptions.length; i++) {
            let optionElement: HTMLOptionElement = document.createElement('option');
            optionElement.value = filterOptions[i];
            optionElement.innerHTML = filterOptions[i];
            this.filterSelectElement.appendChild(optionElement);
        }

        this.filterSelectElement.onchange = () => {
            if (this.filterOptionChanged) this.filterOptionChanged(this.filterSelectElement.value);
        };
    }

    loadSortOptions(sortOptions: Array<string>): void {
        while (this.sortOptionsSelectElement.options.length > 0) {
            this.sortOptionsSelectElement.remove(0);
        }

        for (let i = 0; i < sortOptions.length; i++) {
            let optionElement: HTMLOptionElement = document.createElement('option');
            optionElement.value = sortOptions[i];
            optionElement.innerHTML = sortOptions[i];
            this.sortOptionsSelectElement.appendChild(optionElement);
        }
        this.sortOptionsSelectElement.onchange = () => {
            if (this.sortOptionChanged) this.sortOptionChanged(this.sortOption);
        };
    }

    showEditTaskButton(): void {
        this.editTaskButton.style.visibility = 'visible';
    }

    hideEditTaskButton(): void {
        this.editTaskButton.style.visibility = 'hidden';
    }

    showAppendTextPopup(): void {
        let contents: HTMLElement = this.createAppendTextElement();
        let options: PopupOptions = new PopupOptions();
        options.position = PopupBoxPosition.BelowAlignLeft;
        this.popup.ShowHidePopup(this.appendTextButton, contents, options);
    }

    hideAppendTextPopup(): void {
        this.popup.Hide();
    }

    showRemoveTextPopup(): void {
        let contents: HTMLElement = this.createRemoveTextElement();
        let options: PopupOptions = new PopupOptions();
        options.position = PopupBoxPosition.BelowAlignLeft;
        this.popup.ShowHidePopup(this.removeTextButton, contents, options);
    }

    hideRemoveTextPopup(): void {
        //TODO: implement me
    }

    showSetCompletePoup(): void {
        let contents: HTMLElement = this.createSetCompleteElement();
        let options: PopupOptions = new PopupOptions();
        options.position = PopupBoxPosition.BelowAlignLeft;
        this.popup.ShowHidePopup(this.openSetPopupButton, contents, options);
    }

    showNoItemsSelectedToolbar(): void {
        this.noItemsSelectedToolbar.style.display = 'grid';
    }

    hideNoItemsSelectedToolbar(): void {
        this.noItemsSelectedToolbar.style.display = 'none';
    }

    showItemsSelectedToolbar(): void {
        this.itemsSelectedToolbar.style.display = 'grid';
    }

    hideItemsSelectedToolbar(): void {
        this.itemsSelectedToolbar.style.display = 'none';
    }

    showTaskEditorToolbar(): void {
        this.taskEditorToolbar.style.display = 'grid';
    }

    hideTaskEditorToolbar(): void {
        this.taskEditorToolbar.style.display = 'none';
    }

    loadTasks(tasks: Array<Task>): void {
        this.taskContainer.innerHTML = '';

        for (let i = 0; i < tasks.length; i++) {
            this.addRow(tasks[i], i);
        }
    }

    filterTextFocus(): void {
        this.filterBoxElement.focus();
    }

    newTaskFocus(): void {
        this.newTaskElement.focus();
    }

    appendTextFocus(): void {
        //this.appendTextBox.focus();
    }

    private addMenuItems() {
        let _this: IndexView = this;
        let menu = Menu.getApplicationMenu();

        //loop through the menu items until we find 'View' then append page-specific items
        for (let i = 0; i < menu.items.length; i++) {
            if (menu.items[i].label === 'View') {
                let viewMenu = menu.items[i].submenu;

                viewMenu.append(new MenuItem({type: 'separator'}))

                viewMenu.append(new MenuItem({label: 'Save Filter', click() { 
                        if (_this.saveFilterButtonClicked) _this.saveFilterButtonClicked(); 
                    }}));

                viewMenu.append(new MenuItem({label: 'Delete Filter', click() { 
                        if (_this.deleteFilterButtonClicked) _this.deleteFilterButtonClicked();
                    }}));

                viewMenu.append(new MenuItem({label: 'Archive', click() { 
                        if (_this.archiveButtonClicked) _this.archiveButtonClicked();
                    }}));

                viewMenu.append(new MenuItem({label: 'Show Active Items', type: 'checkbox', checked: true, click(menuItem) { 
                        _this._showActiveItems = menuItem.checked;
                        if (_this.showActiveItemsChanged) _this.showActiveItemsChanged();
                    }}))

                viewMenu.append(new MenuItem({label: 'Show Completed Items', type: 'checkbox', checked: true, click(menuItem) {
                        _this._showCompletedItems = menuItem.checked;
                        if (_this.showCompletedItemsChanged) _this.showCompletedItemsChanged();
                    }}))
            }
        }
    }

    private addRow(task: Task, index: number): void {
        let view: IndexView = this;
        // <div class="task-row" data-task-index="0">
        //     <div class="priority">A</div>
        //     <div class="text">task
        //         <span class="project">+project1</span>
        //         <span class="context">@inbox</span>
        //         <span class="property">due:2018-03-20</span>
        //     </div>
        // </div>

        let row: HTMLDivElement = <HTMLDivElement>document.createElement('div');
        row.className = 'task-row';
        row.setAttribute('data-task-index', index.toString());
        row.onmousedown = (ev: MouseEvent) => {
            let indexAttribute: string | null = row.getAttribute('data-task-index');
            if (indexAttribute !== null) {
                let index: number = parseInt(indexAttribute);
                let clickEvent: RowClickEvent = new RowClickEvent(index, ev.shiftKey, ev.ctrlKey);
                
                if (ev.button < 2) {
                    if (view.taskRowClicked) view.taskRowClicked(clickEvent);
                }
                // else {
                //     if (view.taskRowRightClicked) view.taskRowRightClicked(clickEvent);
                // }
            }
        }

        this.taskContainer.appendChild(row);
        
        let priority: HTMLDivElement = <HTMLDivElement>document.createElement('div');
        switch(task.Priority) {
            case 'A':
                priority.className = 'priority-a';
                break;
            case 'B':
                priority.className = 'priority-b';
                break;
            default:
                priority.className = 'priority-default';
                break;
        }
        row.appendChild(priority);
        priority.innerText = task.Priority == null ? '' : task.Priority;

        let text: HTMLDivElement = <HTMLDivElement>document.createElement('div');
        text.classList.add('text');

        if (task.Completed) {
            text.classList.add('completed');
        }

        row.appendChild(text);
        text.innerText = task.Text;

        if (task.Projects.length > 0) {
            for (let i = 0; i < task.Projects.length; i++) {
                let project: HTMLSpanElement = <HTMLSpanElement>document.createElement('span');
                project.className = 'project';
                text.appendChild(project);
                project.innerText = `+${task.Projects[i]}`;
            }
        }

        if (task.Contexts.length > 0) {
            for (let i = 0; i < task.Contexts.length; i++) {
                let context: HTMLSpanElement = <HTMLSpanElement>document.createElement('span');
                context.className = 'context';
                text.appendChild(context);
                context.innerText = `@${task.Contexts[i]}`;
            }
        }

        if (task.Properties.length > 0) {
            for (let i = 0; i < task.Properties.length; i++) {
                let property: HTMLSpanElement = <HTMLSpanElement>document.createElement('span');
                property.className = 'property';
                text.appendChild(property);
                property.innerText = `${task.Properties[i].Name}:${task.Properties[i].Value}`;
            }
        }
    }

    selectTaskRow(index: number): void {
        let row: HTMLDivElement | null = this.getTaskRowByIndex(index);

        if (row !== null) {
            row.classList.add('selected');
        }
    }

    deSelectTaskRow(index: number): void {
        let row: HTMLDivElement | null = this.getTaskRowByIndex(index);
        if (row !== null) {
            row.classList.remove('selected');
        }
    }

    private getTaskRowByIndex(index: number): HTMLDivElement | null {
        let taskRows = document.getElementsByClassName('task-row');

        for (let i = 0; i < taskRows.length; i++) {
            let row = taskRows[i];
            let indexAttribute: string | null = row.getAttribute('data-task-index');

            if (indexAttribute !== null && parseInt(indexAttribute) === index) {
                return <HTMLDivElement>row;
            }
        }
        
        return null;
    }

    private hideAllToolbarLayouts(): void {
        this.noItemsSelectedToolbar.style.display = 'none';
        this.itemsSelectedToolbar.style.display = 'none';
        this.taskEditorToolbar.style.display = 'none';
    }

    private setupEventHandlers(): void {
        let _this: IndexView = this;

        //click event for dynamically generated elements
        document.addEventListener('click', (event: MouseEvent) => {
            if (event.target) {
                let element: HTMLElement = <HTMLElement>event.target;

                //.append-text-option
                if (element.className === 'append-text-option') {
                    let value: string | null = element.getAttribute('data-value');
                    if (value !== null &&_this.appendTextOptionSelected) {
                        _this.appendTextOptionSelected(value);
                    }
                }

                //#save-append-text-option-textbox
                if (element.id === 'save-append-text-option-textbox') {
                    let appendTextOptionTextbox: HTMLInputElement | null = <HTMLInputElement>document.getElementById('append-text-option-textbox');
                    if (appendTextOptionTextbox !== null && _this.appendTextOptionSelected) {
                        _this.appendTextOptionSelected(appendTextOptionTextbox.value);
                        appendTextOptionTextbox.value = '';
                    }
                }

                //.remove-text-option
                if (element.className === 'remove-text-option') {
                    let value: string | null = element.getAttribute('data-value');
                    if (value !== null &&_this.removeTextOptionSelected) {
                        _this.removeTextOptionSelected(value);
                    }
                }

                //#save-remove-text-option-textbox
                if (element.id === 'save-remove-text-option-textbox') {
                    let removeTextOptionTextbox: HTMLInputElement | null = <HTMLInputElement>document.getElementById('remove-text-option-textbox');
                    if (removeTextOptionTextbox !== null && _this.removeTextOptionSelected) {
                        _this.removeTextOptionSelected(removeTextOptionTextbox.value);
                        removeTextOptionTextbox.value = '';
                    }
                }

                //#set-complete
                if (element.id === 'set-complete') {
                    //let repeatDateTextbox: HTMLInputElement | null = <HTMLInputElement>document.getElementById('repeat-date');
                    // if (repeatDateTextbox !== null && _this.setCompleteButtonClicked) {
                    //     _this.setCompleteButtonClicked(repeatDateTextbox.value === null ? '' : repeatDateTextbox.value);
                    //     repeatDateTextbox.value = '';
                    // }
                    let copyAppendTextTextbox: HTMLInputElement | null = <HTMLInputElement>document.getElementById('copy-append-text');
                    if (copyAppendTextTextbox !== null && _this.setCompleteButtonClicked) {
                        _this.setCompleteButtonClicked(copyAppendTextTextbox.value === null ? '' : copyAppendTextTextbox.value);
                        copyAppendTextTextbox.value = '';
                    }
                }
            }
        })

        _this.filterBoxElement.onkeydown = (ev: KeyboardEvent) => {
            if (_this.filterTextChanged) _this.filterTextChanged(_this.filterText);
        };

        window.onkeydown = (ev: KeyboardEvent) => {
            if (_this.windowKeyPressed) _this.windowKeyPressed(ev.key);
        };

        _this.newTaskElement.onkeydown = (ev: KeyboardEvent) => {
            if (_this.newTaskKeyPressed) _this.newTaskKeyPressed(ev.key);
        }

        _this.addTaskButton.onclick = (ev: MouseEvent) => {
            if (_this.addTaskButtonClicked) _this.addTaskButtonClicked();
        };

        _this.addTaskCancelButton.onclick = (ev: MouseEvent) => {
            if (_this.addTaskCancelButtonClicked) _this.addTaskCancelButtonClicked();
        };

        _this.addTaskSaveButton.onclick = (ev: MouseEvent) => {
            if (_this.addTaskSaveButtonClicked) _this.addTaskSaveButtonClicked();
        };

        _this.editTaskButton.onclick = (ev: MouseEvent) => {
            if (_this.editTaskButtonClicked) _this.editTaskButtonClicked();
        }

        // this.appendRemoveTextButton.onclick = (ev: MouseEvent) => {
        //     if (this.appendRemoveTextButtonClicked) this.appendRemoveTextButtonClicked();
        // }

        _this.appendTextButton.onclick = (ev: MouseEvent) => {
            if (_this.appendTextButtonClicked) _this.appendTextButtonClicked();
            //ev.cancelBubble = true;
        }

        _this.removeTextButton.onclick = (ev: MouseEvent) => {
            if (_this.removeTextButtonClicked) _this.removeTextButtonClicked();
        }

        _this.openSetPopupButton.onclick = (ev: MouseEvent) => {
            if (_this.openSetPopupButtonClicked) _this.openSetPopupButtonClicked();
        }

        // this.appendRemoveSaveButton.onclick = (ev: MouseEvent) => {
        //     if (this.appendRemoveSaveButtonClicked) this.appendRemoveSaveButtonClicked();
        // }

        // this.appendRemoveCancelButton.onclick = (ev: MouseEvent) => {
        //     if (this.appendRemoveCancelButtonClicked) this.appendRemoveCancelButtonClicked();
        // }

        _this.deleteTaskButton.onclick = (ev: MouseEvent) => {
            if (_this.deleteTaskButtonClicked) _this.deleteTaskButtonClicked();
        }

        _this.setPriorityElement.onchange = () => {
            if (_this.setPriorityOptionChanged) _this.setPriorityOptionChanged(_this.setPriorityElement.value);
       };

        // this.setCompleteButton.onclick = (ev: MouseEvent) => {
        //     if (this.markCompleteButtonClicked) this.markCompleteButtonClicked();
        // };

        // this.setIncompleteButton.onclick = (ev: MouseEvent) => {
        //     if (this.markIncompleteButtonClicked) this.markIncompleteButtonClicked();
        // };

        // this.saveFilterButton.onclick = (ev: MouseEvent) => {
        //     if (this.saveFilterButtonClicked) this.saveFilterButtonClicked();
        // };

        // this.deleteFilterButton.onclick = (ev: MouseEvent) => {
        //     if (this.deleteFilterButtonClicked) this.deleteFilterButtonClicked();
        // };

        // this.showCompletedItemsCheckbox.onchange = () => {
        //     if (this.showCompletedItemsChanged) this.showCompletedItemsChanged();
        // }

        // this.showActiveItemsCheckbox.onchange = () => {
        //     if (this.showActiveItemsChanged) this.showActiveItemsChanged();
        // }

        // this.archiveButton.onclick = (ev: MouseEvent) => {
        //     if (this.archiveButtonClicked) this.archiveButtonClicked();
        // }
    }
    
    private createAppendTextElement(): HTMLElement {
        let element: HTMLDivElement = document.createElement('div');
        element.id = 'append-text-popup';
        element.style.backgroundColor = 'white';

        // let element: HTMLUListElement = document.createElement('ul');
        // element.id = 'append-text-popup';
        // element.innerHTML = `
        //         <li><input type='text' /><button>+</button></li>
        //         <li><a href="#">@tag1</a></li>
        //         <li><a href="#">@tag2</a></li>
        //         <li><a href="#">#context1</a></li>
        //         <li><a href="#">#context2</a></li>
        // `;

        let optionsHTML: string = '';

        //private _appendtextOptions: Array<string> | null = null;
        if (this._appendtextOptions !== null) {
            for (let i = 0; i < this._appendtextOptions.length; i++) {
                optionsHTML += `<a href="#" class="append-text-option" data-value="${this._appendtextOptions[i]}">${this._appendtextOptions[i]}</a>`;
            }
        }

        element.innerHTML = `
                <div><input type='text' id="append-text-option-textbox"/><button id="save-append-text-option-textbox">+</button></div>
                ${optionsHTML}
        `;

        return element;
    }

    private createRemoveTextElement(): HTMLElement {
        let element: HTMLDivElement = document.createElement('div');
        element.id = 'remove-text-popup';
        element.style.backgroundColor = 'white';

        let optionsHTML: string = '';

        if (this._removetextOptions !== null) {
            for (let i = 0; i < this._removetextOptions.length; i++) {
                optionsHTML += `<a href="#" class="remove-text-option" data-value="${this._removetextOptions[i]}">${this._removetextOptions[i]}</a>`;
            }
        }

        element.innerHTML = `
                <div><input type='text' id="remove-text-option-textbox"/><button id="save-remove-text-option-textbox">-</button></div>
                ${optionsHTML}
        `;

        return element;
    }

    private createSetCompleteElement(): HTMLElement {
        let element: HTMLDivElement = document.createElement('div');
        element.id = 'set-complete-popup';
        element.style.backgroundColor = 'white';

        element.innerHTML = `
                <div><input type='text' id="copy-append-text" placeholder="copy and append text"/></div>
                <div><button id="set-complete">Set Complete</button></div>
        `;

        // element.innerHTML = `
        //         <div><input type='text' id="repeat-date" placeholder="repeat date"/></div>
        //         <div><button id="set-complete">Set Complete</button></div>
        // `;

        return element;
    }
}
