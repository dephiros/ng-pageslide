/* tslint:disable:no-unused-variable */

import { TestBed} from '@angular/core/testing';
import PageSlideComponent from './pageslide.component';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PageSlideComponent
      ],
    });
    TestBed.compileComponents();
    this.fixture = TestBed.createComponent(PageSlideComponent);
    this.component = this.fixture.debugElement.componentInstance;
  });

  it('test the test', () => {
    expect(true).toBe(true);
  });

});
