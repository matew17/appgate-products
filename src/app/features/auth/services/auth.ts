import { inject, Injectable, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { map, Observable } from 'rxjs';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly oidcSecurityService = inject(OidcSecurityService);

  private isAuthenticatedState = toSignal(
    this.oidcSecurityService.isAuthenticated$,
    {
      initialValue: { isAuthenticated: false, allConfigsAuthenticated: [] },
    }
  );

  public isAuthenticated = computed(
    () => this.isAuthenticatedState()?.isAuthenticated
  );

  public userData = toSignal(this.oidcSecurityService.userData$);

  constructor() {}

  handleAuthCallback(): Observable<LoginResponse> {
    return this.oidcSecurityService.checkAuth();
  }

  checkAuthForGuard() {
    return this.oidcSecurityService
      .checkAuth()
      .pipe(map((result) => result.isAuthenticated));
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }

    window.location.href =
      'https://us-east-2g8ysth0pt.auth.us-east-2.amazoncognito.com/logout?client_id=2e5940k16kibouevvmjsa7e5dc&logout_uri=http://localhost:4200/signout';
  }
}
