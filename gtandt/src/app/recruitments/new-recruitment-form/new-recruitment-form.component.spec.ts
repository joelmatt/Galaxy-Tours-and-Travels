import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRecruitmentFormComponent } from './new-recruitment-form.component';

describe('NewRecruitmentFormComponent', () => {
  let component: NewRecruitmentFormComponent;
  let fixture: ComponentFixture<NewRecruitmentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRecruitmentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRecruitmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
