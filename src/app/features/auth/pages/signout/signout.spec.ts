import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Signout } from './signout';
import { AuthService } from '@app/features/auth/services/auth/auth';

import { Injectable } from '@angular/core';

@Injectable()
export class MockAuthService {
  public login = jasmine.createSpy('login');
  public reset() {
    this.login.calls.reset();
  }
}
describe('Signout Component', () => {
  let fixture: ComponentFixture<Signout>;
  let component: Signout;
  let authServiceMock: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signout],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Signout);
    component = fixture.componentInstance;
    authServiceMock = TestBed.inject(AuthService) as any;
    authServiceMock.reset();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct signout message and title', () => {
    fixture.detectChanges();
    const titleElement: HTMLElement = fixture.debugElement.query(
      By.css('.title')
    ).nativeElement;
    const textElement: HTMLElement = fixture.debugElement.query(
      By.css('.text')
    ).nativeElement;

    expect(titleElement.textContent).toBe('Thank you!');
    expect(textElement.textContent?.trim()).toBe(
      'You have been successfully signed out of the application.'
    );
  });

  it('should call authService.login when the "Sign In Again" button is clicked', () => {
    fixture.detectChanges();

    const signInButton = fixture.debugElement.query(
      By.css('button[appButton]')
    );
    signInButton.triggerEventHandler('click', null);

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(authServiceMock.login).toHaveBeenCalledTimes(1);
  });
});
