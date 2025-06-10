import { Component, inject } from '@angular/core';

import { AuthService } from '@app/features/auth/services/auth/auth';
import { Button } from '@directives/button';
import { Navigation } from '@components/navigation/navigation';
import { NavItem } from '@components/navigation/navitem.interface';
import { Profile } from '@components/profile/profile';

@Component({
  selector: 'app-layout',
  imports: [Navigation, Button, Profile],
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
