export class RowClickEvent {
    constructor(public index: number = 0, 
                public shiftKey: boolean = false,
                public ctrlKey: boolean = false) { }
}