import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

import { Layout } from './layout';
import { Navigation } from '@components/navigation/navigation';
import { Profile } from '@components/profile/profile';
import { Button } from '@directives/button';
import { AuthService } from '@app/features/auth/services/auth/auth';

import { mockAuthService } from '@mocks/services/auth.mock';
import { MockNavigationComponent } from '@mocks/components/navigation.mock';
import { MockProfileComponent } from '@mocks/components/profile.mock';

@Component({
  template: `
    <app-layout>
      <h1 id="projected-title">Main Content</h1>
    </app-layout>
  `,
  standalone: true,
  imports: [Layout],
})
class TestHostComponent {}

describe('Layout Component', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let authServiceMock: typeof mockAuthService;

  beforeEach(async () => {
    mockAuthService.isAuthenticated.set(false);
    mockAuthService.logout.calls.reset();

    await TestBed.configureTestingModule({
      imports: [TestHostComponent, Layout],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideComponent(Layout, {
        remove: { imports: [Navigation, Profile] },
        add: {
          imports: [MockNavigationComponent, MockProfileComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    authServiceMock = TestBed.inject(AuthService) as any;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    const layoutInstance = fixture.debugElement.query(
      By.directive(Layout)
    ).componentInstance;
    expect(layoutInstance).toBeTruthy();
  });

  it('should not display the header when the user is not authenticated', () => {
    authServiceMock.isAuthenticated.set(false);
    fixture.detectChanges();

    const headerElement = fixture.debugElement.query(By.css('header'));
    expect(headerElement).toBeNull();
  });

  it('should display the header with navigation when the user is authenticated', () => {
    authServiceMock.isAuthenticated.set(true);
    fixture.detectChanges();

    const headerElement = fixture.debugElement.query(By.css('header'));
    const navigationElement = fixture.debugElement.query(
      By.directive(MockNavigationComponent)
    );
    expect(headerElement).not.toBeNull();
    expect(navigationElement).not.toBeNull();
  });

  it('should call authService.logout when the sign out button is clicked', () => {
    authServiceMock.isAuthenticated.set(true);
    fixture.detectChanges();

    const logoutButton = fixture.debugElement.query(
      By.css('button[appButton]')
    );
    expect(logoutButton).not.toBeNull();

    logoutButton.triggerEventHandler('click', null);

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(authServiceMock.logout).toHaveBeenCalledTimes(1);
  });

  it('should project main content correctly into <ng-content>', () => {
    fixture.detectChanges();

    const projectedElement = fixture.debugElement.query(
      By.css('#projected-title')
    );
    expect(projectedElement).not.toBeNull();
    expect(projectedElement.nativeElement.textContent).toBe('Main Content');
  });
});
