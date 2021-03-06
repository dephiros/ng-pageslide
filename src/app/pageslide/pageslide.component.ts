// https://github.com/dpiccone/ng-pageslide/blob/master/src/angular-pageslide-directive.js
import {
    Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit,
    Output, SimpleChanges, Renderer2, ChangeDetectionStrategy
} from '@angular/core';

/* tslint:disable */
@Component({
    selector: 'pageslide',
    template: "<ng-content></ng-content>",
    changeDetection: ChangeDetectionStrategy.OnPush
})
/* tslint:enable */

/**
 * this page slide component was based originally on angular 1 pageslide using js to modify style
 * TODO: use js to add/remove class instead of directly modify style.
 * The original decision to use js to modify style directly is due to using left/right/top/bottom with exact px
 * translate would be more performance and exact px is no longer required
 */
export default class PageSlideComponent implements OnInit, OnDestroy, OnChanges {
    public readonly SIDES = {
        top: 'top',
        bottom: 'bottom',
        right: 'right',
        left: 'left'
    };
    public readonly CLASS_STATE = {closed: 'closed', open: 'open'};
    public readonly DEFAULT_SPEED = 0.2;
    public readonly DEFAULT_CLASS = 'ng-pageslide';
    public readonly DEFAULT_SIZE = '300px';
    public readonly DEFAULT_ZINDEX = 1000;

    @Input()
    public set psOpen(value) {
        // don't update slider if value already correct
        if (this.isOpen === value) {
            return;
        }
        this.isOpen = !!value;
        this.psOpenChange.emit(this.isOpen);
        this.updateSlider();
    }

    public get psOpen() {
        return this.isOpen;
    }

    // two way data binding
    @Output() public psOpenChange = new EventEmitter<boolean>();
    @Input() public psAutoClose: boolean;
    @Input() public psSide = this.SIDES.right;
    @Input() public psSpeed = this.DEFAULT_SPEED;
    @Input() public psClass = this.DEFAULT_CLASS;
    @Input() public psSize = this.DEFAULT_SIZE;
    @Input() public psZindex = this.DEFAULT_ZINDEX;
    @Input() public psPush = false;
    @Input() public psContainer = '';
    @Input() public psKeyListener: false;
    @Input() public psBodyClass = false;
    @Input() public psClickOutside = true;
    @Output() public onopen = new EventEmitter<any>();
    @Output() public onclose = new EventEmitter<any>();

    private isOpen = false;
    private isInit = false;
    private body;
    private bodyClass; // this hold the class name for container
    private slider;
    // store version of function that is bound to this so we can add/remove event correctly
    private eventCanceller = new Map();

    constructor(private element: ElementRef, private renderer: Renderer2) {
        this.slider = element.nativeElement;
    }

    public ngOnInit() {
        this.bodyClass = `${this.psClass}-body`;
        this.renderer.addClass(this.slider, this.psClass);
        if (this.psContainer) {
            this.body = (document as any).getElementById(this.psContainer);
        }
        this.body = this.body || document.body;
        this.setBodyClass(this.CLASS_STATE.closed);
        this.body.appendChild(this.slider);

        this.slider.style.zIndex = this.psZindex;
        this.slider.style.position = 'fixed';
        this.slider.style.transitionDuration = this.psSpeed + 's';
        this.slider.style.webkitTransitionDuration = this.psSpeed + 's';
        this.slider.style.height = this.psSize;
        this.slider.style.transitionProperty = 'transform';

        if (this.psPush) {
            this.body.style.position = 'absolute';
            this.body.style.transitionDuration = this.psSpeed + 's';
            this.body.style.webkitTransitionDuration = this.psSpeed + 's';
            this.body.style.transitionProperty = 'padding';
        }

        if (this.psContainer) {
            this.slider.style.position = 'absolute';
            this.body.style.position = 'relative';
            this.body.style.overflow = 'hidden';
        }

        this.initSliderSide();

        // onclose, on open
        this.eventCanceller.set('onTransitionEnd',
            this.renderer.listen(this.slider, 'transitionend', this.onTransitionEnd.bind(this)));
        // autoClose
        /* istanbul ignore if */
        if (this.psAutoClose) {
            this.eventCanceller.set('closeSlider',
                this.renderer.listen(document, 'popstate', this.closeSlider.bind(this)));
        }
        this.isInit = true;
        // this trigger the setter function to make sure the UI reflect the state after init
        this.updateSlider();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.psSize && changes.psSize.currentValue !== changes.psSize.previousValue) {
            this.initSliderSide();
        }
        if (changes.psPush !== undefined) {
            this.psPush = this.psPush && !this.psContainer; // not support push in container
        }
    }

    public ngOnDestroy() {
        if (this.psOpen) {
            // make sure we clean up all the modification on container
            this.psOpen = false;
            this.updateSlider();
        }
        if (this.slider.parentNode === this.body) {
            this.body.removeChild(this.slider);
        }
        for (const eCanceler of Array.from(this.eventCanceller.values())) {
            /* istanbul ignore else */
            if (typeof eCanceler === 'function') {
                eCanceler();
            }
        }
    }

    /* istanbul ignore next  */
    public onTransitionEnd(event) {
        // don't do anything if the event does not come from slider
        if (event.target !== event.currentTarget) {
            return;
        }
        if (this.psOpen) {
            this.onopen.emit(true);
        } else {
            this.onclose.emit(true);
        }
    }

    public closeSlider() {
        // this will get called from setter before init
        /* istanbul ignore if */
        if (!this.isInit) {
            return;
        }
        this.slider.style.transform = `translate(0, 0)`;
        switch (this.psSide) {
            case this.SIDES.right:
                // this.slider.style.right = '-' + this.psSize;
                // this.slider.style.transform = `translate(0, 0)`;
                if (this.psPush) {
                    this.body.style.left = '0px';
                    this.body.style.right = '0px';
                    this.body.style.paddingRight = '0';
                }
                break;
            case this.SIDES.left:
                // this.slider.style.left = '-' + this.psSize;
                // this.slider.style.transform = `translate(0, 0)`;
                if (this.psPush) {
                    this.body.style.left = '0px';
                    this.body.style.right = '0px';
                    this.body.style.paddingLeft = '0';
                }
                break;
            case this.SIDES.top:
                // this.slider.style.top = '-' + this.psSize;
                /* istanbul ignore else */
                if (this.psPush) {
                    this.body.style.top = '0px';
                    this.body.style.bottom = '0px';
                    this.body.style.paddingTop = '0px';
                }
                break;
            case this.SIDES.bottom:
                // this.slider.style.bottom = '-' + this.psSize;
                if (this.psPush) {
                    this.body.style.top = '0px';
                    this.body.style.bottom = '0px';
                    this.body.style.paddingBottom = '0px';
                }
                break;
        }
        this.setBodyClass(this.CLASS_STATE.closed);
        /* istanbul ignore if */
        if (this.eventCanceller.get('handleKeyDown')) {
            this.eventCanceller.get('handleKeyDown')();
        }

        if (this.eventCanceller.get('onBodyClick')) {
            this.eventCanceller.get('onBodyClick')();
        }
        if (this.eventCanceller.get('onBodyClickTouch')) {
            this.eventCanceller.get('onBodyClickTouch')();
        }
    }

    public openSlider() {
        // this will get called from setter before init
        /* istanbul ignore if */
        if (!this.isInit) {
            return;
        }
        switch (this.psSide) {
            case this.SIDES.right:
                this.slider.style.transform = `translate(-100%, 0)`;
                if (this.psPush) {
                    this.body.style.paddingRight = this.psSize;
                }
                break;
            case this.SIDES.left:
                this.slider.style.transform = `translate(100%, 0)`;
                // this.slider.style.left = '0px';
                if (this.psPush) {
                    this.body.style.paddingLeft = this.psSize;
                }
                break;
            case this.SIDES.top:
                this.slider.style.transform = `translate(0, 100%)`;
                // this.slider.style.top = '0px';
                /* istanbul ignore else */
                if (this.psPush) {
                    this.body.style.paddingTop = this.psSize;
                }
                break;
            case this.SIDES.bottom:
                this.slider.style.transform = `translate(0, -100%)`;
                // this.slider.style.bottom = '0px';
                if (this.psPush) {
                    this.body.style.paddingBottom = this.psSize;
                }
                break;
        }
        this.setBodyClass(this.CLASS_STATE.open);
        // we don't want current event that trigger this function to trigger new event handler register below
        /* istanbul ignore next  */
        setTimeout(() => {
            if (this.psKeyListener) {
                this.eventCanceller.set('handleKeyDown',
                    this.renderer.listen(document, 'keydown', this.handleKeyDown.bind(this)));
            }

            if (this.psClickOutside) {
                this.eventCanceller.set('onBodyClick',
                    this.renderer.listen(document, 'click', this.onBodyClick.bind(this)));
                this.eventCanceller.set('onBodyClickTouch',
                    this.renderer.listen(document, 'touchend', this.onBodyClick.bind(this)));
            }
        });
    }

    private initSliderSide() {
        switch (this.psSide) {
            case this.SIDES.right:
                this.slider.style.width = this.psSize;
                this.slider.style.height = '100%';
                this.slider.style.top = '0px';
                this.slider.style.bottom = '0px';
                // this.slider.style.right = '-' + this.psSize + 'px';
                // this.slider.style.right = '0px';
                this.slider.style.left = '100%';
                this.slider.style.transform = `translate(-100%, 0)`;
                break;
            case this.SIDES.left:
                this.slider.style.width = this.psSize;
                this.slider.style.height = '100%';
                this.slider.style.top = '0px';
                this.slider.style.bottom = '0px';
                // this.slider.style.left = '0px';
                this.slider.style.right = '100%';
                break;
            case this.SIDES.top:
                this.slider.style.height = this.psSize;
                this.slider.style.width = '100%';
                this.slider.style.left = '0px';
                // this.slider.style.top = '0px';
                this.slider.style.bottom = '100%';
                this.slider.style.right = '0px';
                break;
            case this.SIDES.bottom:
                this.slider.style.height = this.psSize;
                this.slider.style.width = '100%';
                // this.slider.style.bottom = '0px';
                this.slider.style.top = '100%';
                this.slider.style.left = '0px';
                this.slider.style.right = '0px';
                break;
        }
    }

    private updateSlider() {
        requestAnimationFrame(() => {
            if (this.isOpen) {
                this.openSlider();
            } else {
                this.closeSlider();
            }
        });
    }

    /* istanbul ignore next  */
    private handleKeyDown(e) {
        const ESC_KEY = 27;
        const key = e.keyCode || e.which;

        if (key === ESC_KEY) {
            this.closeSlider();
        }
    }

    private onBodyClick(e) {
        const target = e.touches && e.touches[0] || e.target;
        if (this.psOpen && this.body.contains(target) && !this.slider.contains(target)) {
            this.psOpen = false;
        }
    }

    private setBodyClass(value) {
        if (this.psBodyClass) {
            this.renderer.removeClass(this.body, `${this.bodyClass}-${this.CLASS_STATE.closed}`);
            this.renderer.removeClass(this.body, `${this.bodyClass}-${this.CLASS_STATE.open}`);
            this.renderer.addClass(this.body, `${this.bodyClass}-${value}`);
        }
    }

}
