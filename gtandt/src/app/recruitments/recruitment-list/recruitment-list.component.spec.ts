import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentListComponent } from './recruitment-list.component';

describe('RecruitmentListComponent', () => {
  let component: RecruitmentListComponent;
  let fixture: ComponentFixture<RecruitmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
