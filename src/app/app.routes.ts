import { Routes } from '@angular/router';

import { authGuard } from '@features/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'authorize',
    loadComponent: () =>
      import('./features/auth/pages/authorize/authorize').then(
        (c) => c.Authorize
      ),
  },
  {
    path: 'signout',
    loadComponent: () =>
      import('./features/auth/pages/signout/signout').then((c) => c.Signout),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products').then((c) => c.Products),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
