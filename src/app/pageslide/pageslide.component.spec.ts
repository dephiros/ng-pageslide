/* tslint:disable:no-unused-variable */

import 'reflect-metadata/Reflect';
import {TestBed} from '@angular/core/testing';
import PageSlideComponent from './pageslide.component';
import {Component} from '@angular/core';

const TEST_TEMPLATE = '<pageslide psSide="#SIDE"></pageslide>';
@Component({
  template: TEST_TEMPLATE
})
class TestComponent {

}

describe('pageslide', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageSlideComponent], // declare the test component
    });
    TestBed.compileComponents();
    this.fixture = TestBed.createComponent(PageSlideComponent);
    this.component = this.fixture.debugElement.componentInstance;
  });

  describe('psSide', () => {

    it('should default to right', () => {
      expect(true).toBeTruthy();
    });

    // for (const side of this.component.SIDES) {
    //   describe(`${side}: `, () => {
    //     it('should initialize correctly');
    //     it('should open correctly')
    //   });
    // }
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
  });

  function updateTestComponentAnnotation(annotations) {
    const metaData = Reflect.getMetadata('annotations', TestComponent);
    for (const aKey of annotations.keys) {
      metaData[0][aKey] = annotations[aKey];
    }
    Reflect.defineMetadata('annotations', metaData, TestComponent);
  }

});
