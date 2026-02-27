import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BurnoutFilterComponent } from './burnout-filter.component';

describe('BurnoutFilterComponent', () => {
  let component: BurnoutFilterComponent;
  let fixture: ComponentFixture<BurnoutFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BurnoutFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BurnoutFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
