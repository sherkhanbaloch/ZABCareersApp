import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEmailVerify } from './user-email-verify';

describe('UserEmailVerify', () => {
  let component: UserEmailVerify;
  let fixture: ComponentFixture<UserEmailVerify>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEmailVerify]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEmailVerify);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
