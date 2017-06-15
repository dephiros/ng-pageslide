/* tslint:disable:no-unused-variable */

import 'reflect-metadata/Reflect';
import {Component, ViewChild} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import PageSlideComponent from './pageslide.component';

// do separate class to test code in ngOnInit
@Component({
  template: '<pageslide psSide="top"></pageslide>'
})
class TestTopComponent {
  @ViewChild(PageSlideComponent) public sliderComponent;
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
class TestLeftComponet extends TestTopComponent {
}

describe('pageslide', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PageSlideComponent,
        TestTopComponent,
        TestBottomComponent,
        TestRightComponent,
        TestLeftComponet
      ], // declare the test component
    });
    TestBed.compileComponents();
  });

  describe('pageslide', () => {
    it('should render pageslide', () => {
      const fixture = TestBed.createComponent(PageSlideComponent);
      const component = fixture.debugElement.componentInstance;
      fixture.detectChanges();
      expect(document.getElementsByTagName('pageslide')).not.toBeNull();
    });
  });

  describe('psSide', () => {

    // it('should default to right', () => {
    //   expect(this.component.psSide).toBe(this.component.SIDES.right);
    // });

    const SIDES = ['right', 'left', 'top', 'bottom']; // cannot access this.component here
    for (const side of SIDES) {
      // beforeEach(() => {
      //   TestBed.overrideComponent(TestComponent, {set: {template: `<pageslide psSide="${side}"></pageslide>`}})
      //     .compileComponents();
      // });
      //
      // describe(`${side}: `, () => {
      //   beforeEach(() => {
      //     this.testFixture =  TestBed.createComponent(TestComponent);
      //     this.testComponent = this.testFixture.debugElement.componentInstance;
      //     this.sliderComponent = this.testComponent.sliderComponent;
      //     this.sliderEl = document.getElementsByTagName('pageslide')[0];
      //     this.testFixture.detectChanges();
      //   });
      //
      //   it('should initialize correctly', () => {
      //     console.log(this.sliderComponent.psSide);
      //     switch (side) {
      //       case 'right':
      //       case 'left':
      //         expect(this.sliderEl.style.width).toEqual(this.sliderComponent.psSize);
      //         break;
      //       case 'top':
      //       case 'bottom':
      //         expect(this.sliderEl.style.height).toEqual(this.sliderComponent.psSize);
      //     }
      //   });
      //   it('should open correctly')
      // });
    }
  });

  describe('psSpeed', () => {
    it('should have default speed');
    it('should set transition duration on slider');
    describe('psPush is true: ', () => {
      it('should set the transition duration on body')
    });
  });

  describe('psOpen', () => {
    it('should open the drawer when set to true');
    it('should close the drawer when set to false');
    it('should update the parent attribute when psOpen is changed')
  });

  describe('psClass', () => {
    it('should set the correct class on slider');
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

});
