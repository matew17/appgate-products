import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

@Injectable()
export class MockOidcSecurityService {
  isAuthenticated$ = new BehaviorSubject({ isAuthenticated: false });
  userData$ = new BehaviorSubject<any>(null);
  checkAuth = jasmine
    .createSpy('checkAuth')
    .and.returnValue(this.isAuthenticated$);
  getIdToken = jasmine.createSpy('getIdToken').and.returnValue(of(null));
  authorize = jasmine.createSpy('authorize');

  // Helper methods for tests to control the mock's state
  setAuthenticated(isAuth: boolean) {
    this.isAuthenticated$.next({ isAuthenticated: isAuth });
  }

  setUserData(data: any) {
    this.userData$.next(data);
  }

  setIdToken(token: string | null) {
    this.getIdToken.and.returnValue(of(token));
  }

  reset() {
    this.setAuthenticated(false);
    this.setUserData(null);
    this.setIdToken(null);
    this.checkAuth.calls.reset();
    this.authorize.calls.reset();
  }
}
