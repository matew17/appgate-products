import { Component, inject } from '@angular/core';

import { AuthService } from '@app/features/auth/services/auth';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  authService = inject(AuthService);

  logout() {
    console.log('logout');
    this.authService.logout();
  }
}
