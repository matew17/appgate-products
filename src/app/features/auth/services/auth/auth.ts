import { inject, Injectable, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { map, Observable } from 'rxjs';

import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { environment } from '@env/environment';
import { DecodedIdToken } from './decoded-token.interface';
import { JwtDecoder } from '@services/jwt-decoder';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly jwtDecoder = inject(JwtDecoder);
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

    window.location.href = `${environment.auth.logoutUrl}?client_id=${environment.auth.clientId}&logout_uri=${window.location.origin}/signout`;
  }

  getUserGroups(): Observable<string[] | null> {
    return this.oidcSecurityService.getIdToken().pipe(
      map((token) => {
        if (!token) {
          return null;
        }

        const decodedToken = this.jwtDecoder.decode<DecodedIdToken>(token);

        return decodedToken?.['cognito:groups'] || [];
      })
    );
  }
}
