import { Component, inject } from '@angular/core';

import { AuthService } from '@features/auth/services/auth';
import { Button } from '@directives/button';
import { Navigation } from '@components/navigation/navigation';
import { NavItem } from '@components/navigation/navitem.interface';

@Component({
  selector: 'app-layout',
  imports: [Navigation, Button],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  mainNavItems: NavItem[] = [{ name: 'Products', url: '/products' }];
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
