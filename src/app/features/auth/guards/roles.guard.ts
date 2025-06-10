import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { map } from 'rxjs/operators';

import { AuthService } from '@app/features/auth/services/auth/auth';

export const rolesGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getUserGroups().pipe(
    map((groups) => {
      const hasPermission = groups?.some((role) => ['admins'].includes(role));

      if (hasPermission) {
        return true;
      }

      router.navigate(['/products']);
      return false;
    })
  );
};
