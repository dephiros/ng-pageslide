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
export default class PageSlideComponent implements OnInit, OnDestroy, OnChanges {
  // TODO double check style
  @Input() public set psOpen(value) {
    // don't update slider if value already correct
    if (this.isOpen === value) { return; }
    this.isOpen = !!value;
    this.psOpenChange.emit(this.isOpen);
    this.updateSlider();
  };
  public get psOpen() {
    return this.isOpen;
  }
  // two way data binding
  @Output() public psOpenChange = new EventEmitter<boolean>();
  @Input() public psAutoClose: boolean;
  @Input() public psSide = 'right';
  @Input() public psSpeed = 0.5;
  @Input() public psClass = 'ng-pageslide';
  @Input() public psSize = '300px';
  @Input() public psZindex = 1000;
  @Input() public psPush = false;
  @Input() public psContainer = '';
  @Input() psKeyListener: false;
  @Input() psBodyClass = '';
  @Input() public psClickOutside = true;
  @Output() public onopen = new EventEmitter<any>();
  @Output() public onclose = new EventEmitter<any>();

  private isOpen;
  private isInit = false;
  private body;
  private bodyClass;
  private bodyClassReg;
  private slider;
  // store version of function that is bound to this so we can add/remove event correctly
  private eventCanceller = new Map();
  private readonly CLASS_STATE = {closed: 'closed', open: 'open'};

  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.psPush = this.psPush && !this.psContainer;
    this.slider = element.nativeElement;
  }

  public ngOnInit() {
    this.slider.className += ' ' + this.psClass;
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
    this.slider.style.transitionProperty = 'top, bottom, left, right';

    if (this.psPush) {
      this.body.style.position = 'absolute';
      this.body.style.transitionDuration = this.psSpeed + 's';
      this.body.style.webkitTransitionDuration = this.psSpeed + 's';
      this.body.style.transitionProperty = 'top, bottom, left, right';
    }

    if (this.psContainer) {
      this.slider.style.position = 'absolute';
      this.body.style.position = 'relative';
      this.body.style.overflow = 'hidden';
    }

    this.initSliderSide();

    // onclose, on open
    this.eventCanceller.set('onTransitionEnd', this.renderer.listen(this.slider, 'transitionend', this.onTransitionEnd.bind(this)));
    // autoClose
    if (this.psAutoClose) {
      this.eventCanceller.set('closeSlider', this.renderer.listen(document, 'popstate', this.closeSlider.bind(this)));
    }
    this.isInit = true;
    // this trigger the setter function to make sure the UI reflect the state after init
    this.updateSlider();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['psSize'] && changes['psSize'].currentValue !== changes['psSize'].previousValue) {
      this.initSliderSide();
    }
  }


  public ngOnDestroy() {
    if (this.slider.parentNode === this.body) {
      this.body.removeChild(this.slider);
    }
    for (const eCanceler of Array.from(this.eventCanceller.values())) {
      if (typeof eCanceler === 'function') {
        eCanceler();
      }
    }
  }

  public onTransitionEnd(event) {
    // don't do anything if the event does not come from slider
    if (event.target !== event.currentTarget) { return; }
    if (this.psOpen) {
      this.onopen.emit(true);
    } else {
      this.onclose.emit(true);
    }
  }

  private initSliderSide() {
    switch (this.psSide) {
      case 'right':
        this.slider.style.width = this.psSize;
        this.slider.style.height = '100%';
        this.slider.style.top = '0px';
        this.slider.style.bottom = '0px';
        this.slider.style.right = '0px';
        break;
      case 'left':
        this.slider.style.width = this.psSize;
        this.slider.style.height = '100%';
        this.slider.style.top = '0px';
        this.slider.style.bottom = '0px';
        this.slider.style.left = '0px';
        break;
      case 'top':
        this.slider.style.height = this.psSize;
        this.slider.style.width = '100%';
        this.slider.style.left = '0px';
        this.slider.style.top = '0px';
        this.slider.style.right = '0px';
        break;
      case 'bottom':
        this.slider.style.height = this.psSize;
        this.slider.style.width = '100%';
        this.slider.style.bottom = '0px';
        this.slider.style.left = '0px';
        this.slider.style.right = '0px';
        break;
    }
  }

  private closeSlider() {
    // this will get called from setter before init
    if (!this.isInit) { return; }
    switch (this.psSide) {
      case 'right':
        this.slider.style.right = '-' + this.psSize;
        if (this.psPush) {
          this.body.style.right = '0px';
          this.body.style.left = '0px';
        }
        break;
      case 'left':
        this.slider.style.left = '-' + this.psSize;
        if (this.psPush) {
          this.body.style.left = '0px';
          this.body.style.right = '0px';
        }
        break;
      case 'top':
        this.slider.style.top = '-' + this.psSize;
        if (this.psPush) {
          this.body.style.top = '0px';
          this.body.style.bottom = '0px';
        }
        break;
      case 'bottom':
        this.slider.style.bottom = '-' + this.psSize;
        if (this.psPush) {
          this.body.style.bottom = '0px';
          this.body.style.top = '0px';
        }
        break;
    }
    this.setBodyClass(this.CLASS_STATE.closed);
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


  private openSlider() {
    // this will get called from setter before init
    if (!this.isInit) { return; }
    switch (this.psSide) {
      case 'right':
        this.slider.style.right = '0px';
        if (this.psPush) {
          this.body.style.right = this.psSize;
          this.body.style.left = '-' + this.psSize;
        }
        break;
      case 'left':
        this.slider.style.left = '0px';
        if (this.psPush) {
          this.body.style.left = this.psSize;
          this.body.style.right = '-' + this.psSize;
        }
        break;
      case 'top':
        this.slider.style.top = '0px';
        if (this.psPush) {
          this.body.style.top = this.psSize;
          this.body.style.bottom = '-' + this.psSize;
        }
        break;
      case 'bottom':
        this.slider.style.bottom = '0px';
        if (this.psPush) {
          this.body.style.bottom = this.psSize;
          this.body.style.top = '-' + this.psSize;
        }
        break;
    }
    this.setBodyClass(this.CLASS_STATE.open);
    // we don't want current event that trigger this function to trigger new event handler register below
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
      }
    );
  }

  private updateSlider() {
    if (this.isOpen) {
      this.openSlider();
    } else {
      this.closeSlider();
    }
  }

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
