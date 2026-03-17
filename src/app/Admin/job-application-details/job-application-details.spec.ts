import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplicationDetails } from './job-application-details';

describe('JobApplicationDetails', () => {
  let component: JobApplicationDetails;
  let fixture: ComponentFixture<JobApplicationDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobApplicationDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobApplicationDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
