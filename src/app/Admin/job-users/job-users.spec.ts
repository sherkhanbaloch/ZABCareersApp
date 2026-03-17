import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobUsers } from './job-users';

describe('JobUsers', () => {
  let component: JobUsers;
  let fixture: ComponentFixture<JobUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
