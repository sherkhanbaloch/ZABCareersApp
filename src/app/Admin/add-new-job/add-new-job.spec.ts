import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewJob } from './add-new-job';

describe('AddNewJob', () => {
  let component: AddNewJob;
  let fixture: ComponentFixture<AddNewJob>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewJob]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewJob);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
