import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatePassportInfoComponent } from './candidate-passport-info.component';

describe('CandidatePassportInfoComponent', () => {
  let component: CandidatePassportInfoComponent;
  let fixture: ComponentFixture<CandidatePassportInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatePassportInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatePassportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
