export class Popup {
    private POPUPID: string = 'ui-components-popup';
    private _mutationObserver: MutationObserver | null = null;
    private _container: HTMLElement | null = null;
    private _parentElement: HTMLElement | null = null;

    public ShowHidePopup(parentElement: HTMLElement, content: HTMLElement, options: PopupOptions): void {
        let _this = this;
        this._parentElement = parentElement;

        this._container = document.getElementById(this.POPUPID);

        if (this._container !== null && _this.IsVisible(this._container)) {
            _this.Hide();
            return;
        }

        if (!this._container) {
            this._container = document.createElement("div");
            this._container.appendChild(content);
            this._container.setAttribute("id", this.POPUPID);
            document.body.appendChild(this._container);
        }

        let coordinates: PopupCoordinates = this.GetCoordinates(parentElement, this._container, options);
        this._container.style.position = "absolute";
        this._container.style.top = coordinates.top + "px";
        this._container.style.left = coordinates.left + "px";
        this._container.style.backgroundColor = 'blue';
        //container.style.height = 'min-content';
        //container.style.whiteSpace = 'no-wrap';
        // container.style.height = 'max-content';
        // container.style.width = 'max-content';
        this._container.style.display = 'block';

        let documentClickEventHandler = (event: MouseEvent) => {
            if (event.target && _this._container && _this._parentElement) {
                if (!_this._parentElement.contains(<Node>event.target) && !_this._container.contains(<Node>event.target)) {
                    _this.Hide();
                    document.removeEventListener('click', documentClickEventHandler);
                }
            }
        }

        document.addEventListener('click', documentClickEventHandler);

        if (options.showPointerTriangle && options.position === PopupBoxPosition.RightAlignBottom) {
            //ADD TRIANGLE POINTER
            /*
            .arrow-left {
                width: 0;
                height: 0;
                border-top: 10px solid transparent;
                border-bottom: 10px solid transparent;
                border-right:10px solid blue;
            }
            */

            let largeTriangle: HTMLSpanElement = document.createElement('span');
            largeTriangle.style.position = 'absolute';
            largeTriangle.style.left = '-10px';
            largeTriangle.style.top = `${content.offsetHeight - (21 + options.offsetTop)}px`;
            largeTriangle.style.width = '0';
            largeTriangle.style.height = '0';
            largeTriangle.style.border = '10px solid transparent';
            largeTriangle.style.borderRightColor = options.triangleBorderColor;
            largeTriangle.style.borderLeft = '0';
            largeTriangle.style.zIndex = '1000';


            let smallTriangle: HTMLSpanElement = document.createElement('span');
            smallTriangle.style.position = 'absolute';
            smallTriangle.style.left = '-8px';
            smallTriangle.style.top = `${content.offsetHeight - (20 + options.offsetTop)}px`;
            smallTriangle.style.width = '0';
            smallTriangle.style.height = '0';
            smallTriangle.style.border = '9px solid transparent';
            smallTriangle.style.borderRightColor = options.triangleColor;
            smallTriangle.style.borderLeft = '0';
            smallTriangle.style.zIndex = '2000';

            content.style.position = 'relative';
            content.insertAdjacentElement('afterbegin', largeTriangle);
            content.insertAdjacentElement('afterbegin', smallTriangle);
        }
    }

    public Hide(): void {
        let _this = this;
        this._container = document.getElementById(this.POPUPID);

        if (this._container !== null && this._container !== undefined) {
            document.body.removeChild(this._container);
            //container.style.display = 'none';
        }
    }

    private GetCoordinates(parentElement: HTMLElement, containerElement: HTMLElement, options: PopupOptions): PopupCoordinates {
        let top: number = 0;
        let left: number = 0;
        let leftPointerTriangleOffset: number = 10;
        //let boundingClientRect: ClientRect = null;
        let parentRect: ClientRect = parentElement.getBoundingClientRect();
        let containerRect: ClientRect = containerElement.getBoundingClientRect();

        switch (options.position) {
            case PopupBoxPosition.BelowAlignLeft:
                top = parentRect.top + parentElement.offsetHeight + this.GetScrollPositionY();
                left = parentRect.left;
                break;
            case PopupBoxPosition.RightAlignBottom:
                top = (parentRect.top + parentElement.offsetHeight + this.GetScrollPositionY()) - (containerRect.bottom - containerRect.top);
                left = parentRect.right;
                if (options.showPointerTriangle) { left += leftPointerTriangleOffset };
                break;
        }

        return new PopupCoordinates(top + options.offsetTop, left + options.offsetLeft);
    }

    private GetScrollPositionY(): number {
        if (document.documentElement) {
            return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        }

        return 0;
    }

    private IsVisible(element: HTMLElement): boolean {
        return !!( element.offsetWidth || element.offsetHeight || element.getClientRects().length );
    }
}


class PopupCoordinates {
    constructor(public top: number, public left: number) { }
}


export class PopupOptions {
    position: PopupBoxPosition = PopupBoxPosition.BelowAlignLeft;

    //If position is absolute then offsetTop is the absolute top, otherwise it is the offset 
    //from the default position relative to the parent element.
    offsetTop: number = 0;

    //If position is absolute then offsetLeft is the absolute left, otherwise it is the offset 
    //from the default position relative to the parent element.
    offsetLeft: number = 0;

    //if true, the rest of the page is disabled.
    modal: boolean = false;

    showPointerTriangle: boolean = false;
    triangleColor: string = '#fff';
    triangleBorderColor: string = '#000';
}


export enum PopupBoxPosition {
    Absolute,               //popup will appear in a positioned relative to the page rather than a parent element.
    BelowAlignLeft,         //popup will appear below the parent element with the left side of the popup aligned with the left side of the parent element
    RightAlignBottom,       //popup will appear to the right of the parent element with the bottom of the popup aligned with the bottom of the parent element
}