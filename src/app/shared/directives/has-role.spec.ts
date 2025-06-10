import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { HasRole } from './has-role';
import { AuthService } from '@app/features/auth/services/auth/auth';

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
class MockAuthService {
  private rolesSubject = new BehaviorSubject<string[] | null>([]);

  public logout = jasmine.createSpy('logout');

  public getUserGroups() {
    return this.rolesSubject.asObservable();
  }

  public setUserRoles(roles: string[] | null) {
    this.rolesSubject.next(roles);
  }

  public reset() {
    this.rolesSubject.next([]);
    this.logout.calls.reset();
  }
}

@Component({
  template: `
    <div *appHasRole="requiredRoles">
      <span id="content">Visible Content</span>
    </div>
  `,
  imports: [HasRole],
})
class TestHostComponent {
  requiredRoles: string | string[] = 'admins';
}

describe('HasRole Directive', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let authServiceMock: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    authServiceMock = TestBed.inject(AuthService) as any;
  });

  afterEach(() => {
    authServiceMock.reset();
  });

  const expectContentToBeVisible = (visible: boolean) => {
    const content = fixture.debugElement.query(By.css('#content'));
    expect(!!content).toBe(visible);
  };

  it('should not display the content if the user does not have the required role', () => {
    authServiceMock.setUserRoles(['User']);
    hostComponent.requiredRoles = 'admins';
    fixture.detectChanges();
    expectContentToBeVisible(false);
  });

  it('should display the content if the user has the required role (string)', () => {
    authServiceMock.setUserRoles(['admins']);
    hostComponent.requiredRoles = 'admins';
    fixture.detectChanges();
    expectContentToBeVisible(true);
  });

  it('should display the content if the user has one of the required roles (array)', () => {
    authServiceMock.setUserRoles(['Editor']);
    hostComponent.requiredRoles = ['admins', 'Editor'];
    fixture.detectChanges();
    expectContentToBeVisible(true);
  });

  it('should hide the content if the user has roles, but not the required one', () => {
    authServiceMock.setUserRoles(['User', 'Guest']);
    hostComponent.requiredRoles = 'admins';
    fixture.detectChanges();
    expectContentToBeVisible(false);
  });

  it('should show the content dynamically when user roles are updated to match', () => {
    authServiceMock.setUserRoles(['User']);
    hostComponent.requiredRoles = 'admins';
    fixture.detectChanges();
    expectContentToBeVisible(false);

    authServiceMock.setUserRoles(['User', 'admins']);
    fixture.detectChanges();
    expectContentToBeVisible(true);
  });

  it('should hide the content dynamically when user roles are updated to no longer match', () => {
    authServiceMock.setUserRoles(['admins']);
    hostComponent.requiredRoles = 'admins';
    fixture.detectChanges();
    expectContentToBeVisible(true);

    authServiceMock.setUserRoles(['User']);
    fixture.detectChanges();
    expectContentToBeVisible(false);
  });
});
