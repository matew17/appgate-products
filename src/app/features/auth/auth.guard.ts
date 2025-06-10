import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { map } from 'rxjs/operators';

import { AuthService } from '@app/features/auth/services/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  return authService.checkAuthForGuard().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }

      // Redirect to cognito logic
      authService.login();

      return false;
    })
  );
};
