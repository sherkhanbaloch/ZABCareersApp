import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAppliedJobs } from './user-applied-jobs';

describe('UserAppliedJobs', () => {
  let component: UserAppliedJobs;
  let fixture: ComponentFixture<UserAppliedJobs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAppliedJobs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAppliedJobs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
