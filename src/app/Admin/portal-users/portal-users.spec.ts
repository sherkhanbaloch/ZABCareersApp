import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalUsers } from './portal-users';

describe('PortalUsers', () => {
  let component: PortalUsers;
  let fixture: ComponentFixture<PortalUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortalUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
