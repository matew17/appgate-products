import { Routes } from '@angular/router';

import { rolesGuard } from '@features/auth/guards/roles.guard';

export const productRoutes: Routes = [
  {
    path: '',
    title: 'Product List',
    loadComponent: () =>
      import('./pages/list-products/list-products').then((c) => c.ListProducts),
  },
  {
    path: 'new',
    title: 'Create Product',
    canActivate: [rolesGuard],
    loadComponent: () =>
      import('./pages/create-update-product/create-update-product').then(
        (c) => c.CreateUpdateProduct
      ),
  },
  {
    path: ':id',
    title: 'Product Detail',
    loadComponent: () =>
      import('./pages/product-detail/product-detail').then(
        (c) => c.ProductDetail
      ),
  },
  {
    path: ':id/edit',
    title: 'Edit Product',
    canActivate: [rolesGuard],
    loadComponent: () =>
      import('./pages/create-update-product/create-update-product').then(
        (c) => c.CreateUpdateProduct
      ),
  },
];
