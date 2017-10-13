/* tslint:disable:no-unused-variable */

import {Component, ViewChild} from '@angular/core';
import {async, TestBed} from '@angular/core/testing';
import PageSlideComponent from './pageslide.component';
import 'rxjs/add/observable/fromEvent';

/* tslint:disable:max-classes-per-file */
// do separate class to test code in ngOnInit
@Component({
    template: `
        <pageslide psSide="top" [psSpeed]="speed" [psPush]="true" [(psOpen)]="open"
                   psClass="test" [psSize]="size + 'px'"></pageslide>`
})
class TestTopComponent {
    @ViewChild(PageSlideComponent) public sliderComponent;
    public speed = 0.001;
    public open = false;
    public size = 100;
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
@Component({
    template: `
        <pageslide [psBodyClass]="true" psClass="test" psContainer="container" [psPush]="true"></pageslide>
        <div id="container"></div>`
})
class TestContainerComponent extends TestTopComponent {
}
/* tslint:enable:max-classes-per-file */

describe('pageslide', () => {
    this.initSlider = initSlider;
    this.initSliderWithParams = initSliderWithParams;
    this.openSlider = openSlider;
    this.closeSlider = closeSlider;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                PageSlideComponent,
                TestTopComponent,
                TestBottomComponent,
                TestRightComponent,
                TestLeftComponent,
                TestContainerComponent
            ], // declare the test component
        });
        TestBed.compileComponents();
        window.requestAnimationFrame = ((fn) => {
            if (fn) {
                fn();
                console.log('mock animation frame');
            }
            return 0;
        }) as any;
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
                this.initSliderWithParams(TestTopComponent);
            });
            it('should start being closed', () => {
                expect(this.sliderEl.style.height).toEqual(this.sliderComponent.psSize);
                expect(this.sliderEl.style.width).toEqual('100%');
                expect(isTopClose(this.sliderEl)).toBeTruthy();
            });
            it('should open correctly', () => {
                this.sliderComponent.openSlider();
                expect(isTopOpen(this.sliderEl)).toBeTruthy();
            });
        });

        describe('bottom', () => {
            beforeEach(() => {
                this.initSliderWithParams(TestBottomComponent);
            });
            it('should start being closed', () => {
                expect(this.sliderEl.style.height).toEqual(this.sliderComponent.psSize);
                expect(this.sliderEl.style.width).toEqual('100%');
                expect(isBottomClose(this.sliderEl)).toBeTruthy();
            });
            it('should open correctly', () => {
                this.openSlider();
                this.testFixture.detectChanges();
                expect(isBottomOpen(this.sliderEl)).toBeTruthy();
            });
        });

        describe('left', () => {
            beforeEach(() => {
                this.initSliderWithParams(TestLeftComponent);
            });
            it('should start being closed', () => {
                expect(this.sliderEl.style.width).toEqual(this.sliderComponent.psSize);
                expect(this.sliderEl.style.height).toEqual('100%');
                expect(isLeftClose(this.sliderEl)).toBeTruthy();
            });
            it('should open correctly', () => {
                this.openSlider();
                this.testFixture.detectChanges();
                expect(isLeftOpen(this.sliderEl)).toBeTruthy();
            });
        });

        describe('right', () => {
            beforeEach(() => {
                this.initSliderWithParams(TestRightComponent);
            });
            it('should start being closed', () => {
                expect(this.sliderEl.style.width).toEqual(this.sliderComponent.psSize);
                expect(this.sliderEl.style.height).toEqual('100%');
                expect(isRightClose(this.sliderEl)).toBeTruthy();
            });
            it('should open correctly', () => {
                this.openSlider();
                this.testFixture.detectChanges();
                expect(isRightOpen(this.sliderEl)).toBeTruthy();
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
            this.initSliderWithParams();
            expect(this.sliderEl.style.transitionDuration).toBe(this.containerComponent.speed + 's');
        });

        describe('psPush is true: ', () => {
            beforeEach(() => {
                this.initSliderWithParams();
            });
            it('should set the transition duration on body', () => {
                expect(document.body.style.transitionDuration).toBe(this.sliderComponent.psSpeed + 's');
            });
        });
    });

    describe('psOpen', () => {
        beforeEach(() => {
            this.initSliderWithParams();
            this.openSlider();
            this.testFixture.detectChanges();
        });
        it('should open the drawer when set to true', () => {
            expect(isTopOpen(this.sliderEl)).toBeTruthy();
        });
        it('should update the parent attribute when psOpen is changed', () => {
            this.containerComponent.open = true;
            this.testFixture.detectChanges();
            this.closeSlider(this.sliderComponent);
            this.testFixture.detectChanges();
            expect(this.containerComponent.open).toBeFalsy();
        });
    });

    describe('psClass', () => {
        it('should use the default class if no psClass', () => {
            this.initSlider();
            expect(this.sliderComponent.psClass).toEqual(this.sliderComponent.DEFAULT_CLASS);
        });
        describe('when psClass is set', () => {
            beforeEach(() => {
                this.initSliderWithParams();
            });
        });
        it('should set the correct class on slider', () => {
            expect(this.sliderEl.className.split(' ')).toContain('test');
        });
        describe('when psBodyClass is true', () => {
            beforeEach(() => {
                this.initSliderWithParams(TestContainerComponent);
            });
            it('should set the correct class on slider container when slider is closed', () => {
                expect(this.sliderComponent.body.className.split(' '))
                    .toContain(`test-body-${this.sliderComponent.CLASS_STATE.closed}`);
            });
            it('should set the correct class on slider container when slider is opened', () => {
                this.openSlider();
                expect(this.sliderComponent.body.className.split(' '))
                    .toContain(`test-body-${this.sliderComponent.CLASS_STATE.open}`);
            });
        });
    });

    describe('pushContent', () => {
        describe('when psContainer is not set', () => {
            beforeEach(() => {
                this.initSliderWithParams();
            });

            describe('and psSide is top', () => {
                beforeEach(() => {
                    this.sliderComponent.psSide = this.sliderComponent.SIDES.top;
                    this.openSlider();
                    this.testFixture.detectChanges();
                });
                it('should set body style in closed state', () => {
                    this.closeSlider();
                    this.testFixture.detectChanges();
                    expect(this.sliderComponent.body.style.top).toEqual('0px');
                    expect(this.sliderComponent.body.style.bottom).toEqual('0px');
                    expect(this.sliderComponent.body.style.paddingTop).toEqual('0px');
                });
                it('should push the content in body', () => {
                    expect(this.sliderComponent.body.style.paddingTop).toEqual(this.sliderComponent.psSize);
                });
            });

            describe('and psSide is bottom', () => {
                beforeEach(() => {
                    this.sliderComponent.psSide = this.sliderComponent.SIDES.bottom;
                    this.openSlider();
                    this.testFixture.detectChanges();
                });
                it('should set body style in closed state', () => {
                    this.closeSlider();
                    this.testFixture.detectChanges();
                    expect(this.sliderComponent.body.style.top).toEqual('0px');
                    expect(this.sliderComponent.body.style.bottom).toEqual('0px');
                    expect(this.sliderComponent.body.style.paddingBottom).toEqual('0px');
                });
                it('should push the content in body', () => {
                    expect(this.sliderComponent.body.style.paddingBottom).toEqual(this.sliderComponent.psSize);
                });
            });

            describe('and psSide is left', () => {
                beforeEach(() => {
                    this.sliderComponent.psSide = this.sliderComponent.SIDES.left;
                    this.openSlider();
                    this.testFixture.detectChanges();
                });
                it('should set body style in closed state', () => {
                    this.closeSlider();
                    this.testFixture.detectChanges();
                    expect(this.sliderComponent.body.style.left).toEqual('0px');
                    expect(this.sliderComponent.body.style.right).toEqual('0px');
                    expect(this.sliderComponent.body.style.paddingLeft).toEqual('0px');
                });
                it('should push the content in body', () => {
                    expect(this.sliderComponent.body.style.paddingLeft).toEqual(this.sliderComponent.psSize);
                });
            });

            describe('and psSide is right', () => {
                beforeEach(() => {
                    this.sliderComponent.psSide = this.sliderComponent.SIDES.right;
                    this.sliderComponent.openSlider();
                    this.testFixture.detectChanges();
                });
                it('should set body style in closed state', () => {
                    this.sliderComponent.closeSlider();
                    this.testFixture.detectChanges();
                    expect(this.sliderComponent.body.style.left).toEqual('0px');
                    expect(this.sliderComponent.body.style.right).toEqual('0px');
                    expect(this.sliderComponent.body.style.paddingRight).toEqual('0px');
                });
                it('should push the content in body', () => {
                    expect(this.sliderComponent.body.style.paddingRight).toEqual(this.sliderComponent.psSize);
                });
            });
        });
        describe('when psContainer is set', () => {
            it('psPush should be off', () => {
                // the container has push but should not take effect
                this.initSliderWithParams(TestContainerComponent);
                expect(this.sliderComponent.psPush).toBeFalsy();
            });
        });
    });

    describe('psSize', () => {
        it('slider should start with default size if not specified', () => {
            this.initSlider();
            expect(this.sliderComponent.psSize).toEqual(this.sliderComponent.DEFAULT_SIZE);
        });

        describe('when size is specified', () => {
            beforeEach(() => {
                this.initSliderWithParams();
            });
            it('slider should use specified size', () => {
                expect(this.sliderComponent.psSize).toEqual(this.containerComponent.size + 'px');
            });
            it('slider size should change dynamically', () => {
                const testSize = 500;
                this.containerComponent.size = testSize;
                this.testFixture.detectChanges();
                expect(this.sliderComponent.psSize).toEqual(testSize + 'px');
            });
        });
    });

    describe('click outside to close', () => {
        it('by default psClickOutside is init to true', () => {
            this.initSlider();
            expect(this.sliderComponent.psClickOutside).toBeTruthy();
        });

        // TODO figure out how to test these event
        // describe('when psClickOutside is set to true', () => {
        //   beforeEach(() => {
        //     this.initSliderWithParams();
        //     // open the slider
        //     this.openSlider();
        //     this.testFixture.detectChanges();
        //   });
        //   it('clicking outside should close slider', fakeAsync(() => {
        //     document.body.click();
        //     this.testFixture.debugElement.triggerEventHandler('click');
        //     // set timeout so the click is handled
        //     tick();
        //     this.testFixture.detectChanges();
        //     expect(this.sliderComponent.psOpen).toBeFalsy();
        //   }));
        //   it('clicking outside should not close slider if psClickOutside is false', () => {
        //     document.body.click();
        //     // set timeout so the click is handled
        //     setTimeout(() => {
        //       this.testFixture.detectChanges();
        //       expect(this.sliderComponent.psOpen).toBeTruthy();
        //     });
        //   })
        // });
    });

    // TODO figure out how to test these event
    // describe('event', () => {
    //   beforeEach(() => {
    //     this.initSlider();
    //   });
    //   it('should trigger open event when slider open', (done: any) => {
    //     this.sliderComponent.onopen.subscribe(() => {
    //       done();
    //     });
    //     this.openSlider();
    //     this.testFixture.debugElement.triggerEventHandler('transitionend',
    //       {target: this.sliderEl, currenTarget: this.sliderEl});
    //     this.testFixture.detectChanges();
    //   });
    //   it('should trigger close event when slider close', (done: any) => {
    //     //  have to open before can close
    //     this.openSlider();
    //     this.testFixture.detectChanges();
    //     this.sliderComponent.onclose.subscribe(() => {
    //       done();
    //     });
    //     this.closeSlider();
    //     this.testFixture.debugElement.triggerEventHandler('transitionend',
    //       {target: this.sliderEl, currenTarget: this.sliderEl});
    //     this.testFixture.detectChanges();
    //   });
    //   it('transitionend event not come from slider will not trigger open/close event');
    // });

    describe('container', () => {
        it('should attach page slide by default to body', () => {
            this.initSliderWithParams();
            expect(this.sliderEl.parentElement).toBe(document.body);
        });

        it('should attach page slide to specified container', () => {
            this.initSliderWithParams(TestContainerComponent);
            expect(this.sliderEl.parentElement).toBe(document.getElementById('container'));
        });
    });

    /**
     * use for test most case with outer container
     */
    function initSliderWithParams(containerClass = TestTopComponent) {
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
        return sliderEl.style.transform === 'translate(0px, 100%)';
    }

    function isTopClose(sliderEl: HTMLElement): boolean {
        return sliderEl.style.transform === 'translate(0px, 0px)';
    }

    function isBottomOpen(sliderEl: HTMLElement): boolean {
        return sliderEl.style.transform === 'translate(0px, -100%)';
    }

    function isBottomClose(sliderEl: HTMLElement): boolean {
        return sliderEl.style.transform === 'translate(0px, 0px)';
    }
    function isLeftOpen(sliderEl: HTMLElement): boolean {
        return sliderEl.style.transform === 'translate(100%, 0px)';
    }

    function isLeftClose(sliderEl: HTMLElement): boolean {
        return sliderEl.style.transform === 'translate(0px, 0px)';
    }
    function isRightOpen(sliderEl: HTMLElement): boolean {
        return sliderEl.style.transform === 'translate(-100%, 0px)';
    }

    function isRightClose(sliderEl: HTMLElement): boolean {
        return sliderEl.style.transform === 'translate(0px, 0px)';
    }

    function openSlider() {
        this.sliderComponent.openSlider();
        this.sliderComponent.psOpen = true;
    }

    function closeSlider() {
        this.sliderComponent.closeSlider();
        this.sliderComponent.psOpen = false;
    }

});
