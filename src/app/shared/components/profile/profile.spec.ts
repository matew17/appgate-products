import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Profile } from './profile';
import { AuthService } from '@app/features/auth/services/auth/auth';
import { mockAuthService } from '@mocks/services/auth.mock';

describe('Profile Component', () => {
  let fixture: ComponentFixture<Profile>;
  let component: Profile;
  let authServiceMock: typeof mockAuthService;

  beforeEach(async () => {
    mockAuthService.isAuthenticated.set(false);
    mockAuthService.userData.set(null);

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    authServiceMock = TestBed.inject(AuthService) as any;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not display anything when user is not authenticated', () => {
    authServiceMock.isAuthenticated.set(false);
    fixture.detectChanges();

    const greetingElement = fixture.debugElement.query(
      By.css('.profile-greeting')
    );
    expect(greetingElement).toBeNull();
  });

  it('should display the greeting when user is authenticated', () => {
    authServiceMock.isAuthenticated.set(true);
    fixture.detectChanges();

    const greetingElement = fixture.debugElement.query(
      By.css('.profile-greeting')
    );
    expect(greetingElement).not.toBeNull();
  });

  it('should display the user email when authenticated and user data is available', () => {
    authServiceMock.isAuthenticated.set(true);
    authServiceMock.userData.set({ userData: { email: 'test@example.com' } });
    fixture.detectChanges();

    const spanElement: HTMLElement = fixture.debugElement.query(
      By.css('.profile-greeting span')
    ).nativeElement;

    expect(spanElement.textContent).toContain('Hello, test@example.com');
  });

  it('should dynamically show the greeting when the user logs in', () => {
    authServiceMock.isAuthenticated.set(false);
    fixture.detectChanges();
    let greetingElement = fixture.debugElement.query(
      By.css('.profile-greeting')
    );
    expect(greetingElement).toBeNull();

    authServiceMock.isAuthenticated.set(true);
    authServiceMock.userData.set({ userData: { email: 'login@test.com' } });
    fixture.detectChanges();

    greetingElement = fixture.debugElement.query(By.css('.profile-greeting'));
    expect(greetingElement).not.toBeNull();
    expect(greetingElement.nativeElement.textContent).toContain(
      'login@test.com'
    );
  });
});
