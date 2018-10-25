import {Task} from '../../core/domain/Task';
import {RowClickEvent} from './RowClickEvent';

export interface IIndexView {
    //PROPERTIES
    sortOption: string;
    filterText: string;
    filterOption: string;
    setPriorityOption: string;
    newTask: string;
    showingCount: string;
    selectedCount: string;
    removeText: string;
    removeTextOptions: Array<string>;
    appendText: string;
    appendTextOptions: Array<string>;
    showCompletedItems: boolean;
    showActiveItems: boolean;
    setCompleteRepeatDate: string;
    setCompleteRemoveText: string;
    setCompleteAppendText: string;


    //FUNCTIONS
    loadFilterOptions(filterOptions: Array<string>): void;

    /**Sets the focus to the filterText input element. */
    filterTextFocus(): void;

    loadSortOptions(sortOptions: Array<string>): void;

    //hideEditTaskForm(): void;
    //showEditTaskForm(): void;
    showEditTaskButton(): void;
    hideEditTaskButton(): void;

    //hideAddTaskForm(): void;
    //showAddTaskForm(): void;

    //hideAppendRemoveForm(): void;
    //showAppendRemoveForm(): void;
    showAppendTextPopup(): void;
    hideAppendTextPopup(): void;
    showRemoveTextPopup(): void;
    hideRemoveTextPopup(): void;

    showSetCompletePoup(): void;

    showNoItemsSelectedToolbar(): void;
    hideNoItemsSelectedToolbar(): void;
    showItemsSelectedToolbar(): void;
    hideItemsSelectedToolbar(): void;
    showTaskEditorToolbar(): void;
    hideTaskEditorToolbar(): void;


    /**Sets the focus to the newTask input element.*/
    newTaskFocus(): void;

    /**Sets the focus to the appendText input element.*/
    appendTextFocus(): void;

    loadTasks(tasks: Array<Task>): void;

    /**Selects the task row at the given index.*/
    selectTaskRow(index: number): void;

    /**Deselects the task row at the given index.*/
    deSelectTaskRow(index: number): void;


    //EVENT CALLBACKS
    sortOptionChanged?: (sortOption: string) => void;
    filterTextChanged?: (filterText: string) => void;
    filterOptionChanged?: (filterText: string) => void;
    setPriorityOptionChanged?: (priorityOption: string) => void;
    taskRowClicked?: (rowClickEvent: RowClickEvent) => void;
    //taskRowRightClicked?: (rowClickEvent: RowClickEvent) => void;
    windowKeyPressed?: (key: string) => void;
    newTaskKeyPressed?: (key: string) => void;
    addTaskButtonClicked?: () => void;
    addTaskCancelButtonClicked?: () => void;
    addTaskSaveButtonClicked?: () => void;
    editTaskButtonClicked?: () => void;
    //appendRemoveTextButtonClicked?: () => void;
    appendTextButtonClicked?: () => void;
    appendTextOptionSelected?: (textToAppend: string) => void;
    removeTextButtonClicked?: () => void;
    removeTextOptionSelected?: (textToRemove: string) => void;
    openSetPopupButtonClicked?: () => void;
    setCompleteButtonClicked?: (repeatDate: string) => void;
    appendRemoveSaveButtonClicked?: () => void;
    appendRemoveCancelButtonClicked?: () => void;
    deleteTaskButtonClicked?: () => void;
    markCompleteButtonClicked?: () => void;
    markIncompleteButtonClicked?: () => void;
    saveFilterButtonClicked?: () => void;
    deleteFilterButtonClicked?: () => void;
    showCompletedItemsChanged?: () => void;
    showActiveItemsChanged?: () => void;
    archiveButtonClicked?: () => void;
}

export class TaskUpdate {
    constructor(public taskRawText: string = '', public originalTask?: Task) { }
}
