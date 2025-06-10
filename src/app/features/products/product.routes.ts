import { Routes } from '@angular/router';

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
    loadComponent: () =>
      import('./pages/create-update-product/create-update-product').then(
        (c) => c.CreateUpdateProduct
      ),
  },
  {
    path: 'edit/:id',
    title: 'Edit Product',
    loadComponent: () =>
      import('./pages/create-update-product/create-update-product').then(
        (c) => c.CreateUpdateProduct
      ),
  },
];
