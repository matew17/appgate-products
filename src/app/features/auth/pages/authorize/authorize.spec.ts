import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { Authorize } from './authorize';
import { AuthService } from '@app/features/auth/services/auth/auth';
import { Spinner } from '@components/spinner/spinner';

import { MockSpinner } from '@mocks/components/spinner.mock';
import { mockRouter } from '@testing/router.mock';

describe('Authorize Component', () => {
  let fixture: ComponentFixture<Authorize>;
  let component: Authorize;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerMock: typeof mockRouter;

  beforeEach(async () => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', [
      'handleAuthCallback',
    ]);

    await TestBed.configureTestingModule({
      imports: [Authorize],
      providers: [
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: Router, useValue: mockRouter },
      ],
    })
      .overrideComponent(Authorize, {
        remove: { imports: [Spinner] },
        add: { imports: [MockSpinner] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Authorize);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerMock = TestBed.inject(Router) as any;
    routerMock.navigateByUrl.calls.reset();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call handleAuthCallback on initialization', () => {
    authServiceSpy.handleAuthCallback.and.returnValue(
      of({
        isAuthenticated: true,
        userData: null,
        accessToken: 'mock-access-token',
        idToken: 'mock-id-token',
      })
    );
    fixture.detectChanges();
    expect(authServiceSpy.handleAuthCallback).toHaveBeenCalled();
  });

  it('should navigate to the returnUrl if it exists in the loginResponse', () => {
    const loginResponse = {
      isAuthenticated: true,
      userData: { returnUrl: '/dashboard/my-profile' },
      accessToken: 'mock-access-token',
      idToken: 'mock-id-token',
    };
    authServiceSpy.handleAuthCallback.and.returnValue(of(loginResponse));

    fixture.detectChanges();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(
      '/dashboard/my-profile',
      {
        replaceUrl: true,
      }
    );
  });

  it('should navigate to the fallback URL "/products" if returnUrl does not exist', () => {
    const loginResponse = {
      isAuthenticated: true,
      userData: null,
      accessToken: 'mock-access-token',
      idToken: 'mock-id-token',
    };
    authServiceSpy.handleAuthCallback.and.returnValue(of(loginResponse));

    fixture.detectChanges();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/products', {
      replaceUrl: true,
    });
  });

  it('should navigate to the fallback URL "/products" if userData is undefined', () => {
    const loginResponse = {
      isAuthenticated: true,
      userData: undefined,
      accessToken: 'mock-access-token',
      idToken: 'mock-id-token',
    };
    authServiceSpy.handleAuthCallback.and.returnValue(of(loginResponse));

    fixture.detectChanges();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/products', {
      replaceUrl: true,
    });
  });
});
