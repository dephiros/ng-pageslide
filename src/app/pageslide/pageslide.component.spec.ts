/* tslint:disable:no-unused-variable */

import 'reflect-metadata/Reflect';
import {Component, ViewChild} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import PageSlideComponent from './pageslide.component';

// do separate class to test code in ngOnInit
@Component({
  template: `<pageslide psSide="top" [psSpeed]="speed" [psPush]="true" [(psOpen)]="open"
  psClass="test"></pageslide>`
})
class TestTopComponent {
  @ViewChild(PageSlideComponent) public sliderComponent;
  public speed = 0.7;
  public open = false;
}
@Component({
  template: '<pageslide psSide="bottom"></pageslide>'
})
class TestBottomComponent extends TestTopComponent {
}
@Component({
  template: '<pageslide psSide="right"></pageslide>'
})
class TestRightComponent extends TestTopComponent {
}
@Component({
  template: '<pageslide psSide="left"></pageslide>'
})
class TestLeftComponent extends TestTopComponent {
}

describe('pageslide', () => {
  this.initSlider = initSlider;
  this.initSliderContainer = initSliderContainer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PageSlideComponent,
        TestTopComponent,
        TestBottomComponent,
        TestRightComponent,
        TestLeftComponent
      ], // declare the test component
    });
    TestBed.compileComponents();
  });

  describe('pageslide', () => {
    it('should render pageslide', () => {
      this.initSlider();
      const el = document.getElementsByTagName('pageslide')[0];
      expect(document.getElementsByTagName('pageslide')).not.toBeFalsy();
    });
  });

  describe('psSide', () => {
    describe('top', () => {
      beforeEach(() => {
        this.initSliderContainer(TestTopComponent);
      });
      it('should start being closed', () => {
        expect(this.sliderEl.style.height).toEqual(this.sliderComponent.psSize);
        expect(this.sliderEl.style.width).toEqual('100%');
        expect(isTopClose(this.sliderEl, this.sliderComponent.psSize)).toBeTruthy();
      });
      it('should open correctly', () => {
        this.sliderComponent.psOpen = true;
        this.testFixture.detectChanges();
        expect(isTopOpen(this.sliderEl)).toBeTruthy();
      });
    });

    describe('bottom', () => {
      beforeEach(() => {
        this.initSliderContainer(TestBottomComponent);
      });
      it('should start being closed', () => {
        expect(this.sliderEl.style.height).toEqual(this.sliderComponent.psSize);
        expect(this.sliderEl.style.width).toEqual('100%');
        expect(this.sliderEl.style.bottom).toEqual(`-${this.sliderComponent.psSize}`)
      });
      it('should open correctly', () => {
        this.sliderComponent.psOpen = true;
        this.testFixture.detectChanges();
        expect(this.sliderEl.style.bottom).toEqual('0px');
      });
    });

    describe('left', () => {
      beforeEach(() => {
        this.initSliderContainer(TestLeftComponent);
      });
      it('should start being closed', () => {
        expect(this.sliderEl.style.width).toEqual(this.sliderComponent.psSize);
        expect(this.sliderEl.style.height).toEqual('100%');
        expect(this.sliderEl.style.left).toEqual(`-${this.sliderComponent.psSize}`)
      });
      it('should open correctly', () => {
        this.sliderComponent.psOpen = true;
        this.testFixture.detectChanges();
        expect(this.sliderEl.style.left).toEqual('0px');
      });
    });

    describe('right', () => {
      beforeEach(() => {
        this.initSliderContainer(TestRightComponent);
      });
      it('should start being closed', () => {
        expect(this.sliderEl.style.width).toEqual(this.sliderComponent.psSize);
        expect(this.sliderEl.style.height).toEqual('100%');
        expect(this.sliderEl.style.right).toEqual(`-${this.sliderComponent.psSize}`)
      });
      it('should open correctly', () => {
        this.sliderComponent.psOpen = true;
        this.testFixture.detectChanges();
        expect(this.sliderEl.style.right).toEqual('0px');
      });
    });
  });


  describe('psSpeed', () => {
    it('should have default speed', () => {
      const testFixture = TestBed.createComponent(PageSlideComponent);
      const component = testFixture.componentInstance;
      expect(component.psSpeed).toBe(component.DEFAULT_SPEED);
    });
    it('should set transition duration on slider', () => {
      this.initSliderContainer();
      expect(this.sliderEl.style.transitionDuration).toBe(this.containerComponent.speed + 's');
    });

    describe('psPush is true: ', () => {
      beforeEach(() => {
        this.initSliderContainer();
      });
      it('should set the transition duration on body', () => {
        expect(document.body.style.transitionDuration).toBe(this.sliderComponent.psSpeed + 's');
      });
    });
  });

  describe('psOpen', () => {
    beforeEach(() => {
      this.initSliderContainer();
    });
    it('should open the drawer when set to true', () => {
      this.containerComponent.open = true;
      this.testFixture.detectChanges();
      expect(isTopOpen(this.sliderEl)).toBeTruthy();
    });
    it('should close the drawer when set to false', () => {
      this.containerComponent.open = true;
      this.testFixture.detectChanges();
      this.containerComponent.open = false;
      this.testFixture.detectChanges();
      expect(isTopClose(this.sliderEl, this.sliderComponent.psSize)).toBeTruthy();
    });
    it('should update the parent attribute when psOpen is changed', () => {
      this.containerComponent.open = true;
      this.testFixture.detectChanges();
      this.sliderComponent.psOpen = false;
      expect(this.containerComponent.open).toBeFalsy();
    })
  });

  describe('psClass', () => {
    it('should use the default class if no psClass', () => {
      initSlider.bind(this)();
      expect(this.sliderComponent.psClass).toEqual(this.sliderComponent.DEFAULT_CLASS);
    });
    describe('when psClass is set', () => {
      beforeEach(() => {
        this.testFixture = TestBed.createComponent(TestTopComponent);
        this.containerComponent = this.testFixture.sliderComponent;
      });
    });
    it('should set the correct class on slider', () => {
    });
    it('should set the correct class on slider container when slider is closed');
    it('should set the correct class on slider container when slider is opened');
  });

  describe('pushContent', () => {
    describe('when psContainer is not set', () => {
      it('should push the content in body')
    });
    describe('when psContainer is set', () => {
      it('psPush should be off');
    })
  });

  describe('psSize', () => {
    it('slider should start with default size if not specified');
    it('slider should use specified size');
    it('slider size should change dynamically');
  });

  describe('click outside to close', () => {
    it('by default psClickOutside is init to true');
    describe('psClickOutside is set to true', () => {
      it('clicking outside should close slider');
      it('clicking outside should update parent psOpen');
    });
    describe('psClickOutside is set to false', () => {
      it('clicking outside should not have effect');
    });
  });

  describe('event', () => {
    it('should trigger open event when slider open');
    it('should trigger close event when slider close');
    it('transitionend event not come from slider will not trigger open/close event');
  });

  describe('container', () => {
    it('should attach page slide by default to body');
  });

  /**
   * use for test most case with outer container
   */
  function initSliderContainer(containerClass = TestTopComponent) {
    this.testFixture = TestBed.createComponent(containerClass);
    this.containerComponent = this.testFixture.componentInstance;
    this.sliderComponent = this.containerComponent.sliderComponent;
    this.sliderEl = document.getElementsByTagName('pageslide')[0];
    this.testFixture.detectChanges();
  }

  /**
   * use to test most case with default value
   */
  function initSlider() {
    this.testFixture = TestBed.createComponent(PageSlideComponent);
    this.sliderComponent = this.testFixture.componentInstance;
    this.testFixture.detectChanges();
  }

  function isTopOpen(sliderEl: HTMLElement): boolean {
    return sliderEl.style.top === '0px';
  }

  function isTopClose(sliderEl: HTMLElement, psSize): boolean {
    return sliderEl.style.top === '-' + psSize;
  }

});
