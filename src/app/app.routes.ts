import { Routes } from '@angular/router';

import { authGuard } from '@app/features/auth/guards/auth.guard';

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
    loadChildren: () =>
      import('./features/products/product.routes').then((r) => r.productRoutes),
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
