import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnSubmitPopupComponent } from './on-submit-popup.component';

describe('OnSubmitPopupComponent', () => {
  let component: OnSubmitPopupComponent;
  let fixture: ComponentFixture<OnSubmitPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnSubmitPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnSubmitPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
