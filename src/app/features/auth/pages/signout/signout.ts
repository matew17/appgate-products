import { Component, inject } from '@angular/core';
import { Button } from '@directives/button';
import { AuthService } from '@features/auth/services/auth';

@Component({
  selector: 'app-signout',
  imports: [Button],
  templateUrl: './signout.html',
  styleUrl: './signout.scss',
})
export class Signout {
  private authService = inject(AuthService);

  signIn(): void {
    this.authService.login();
  }
}
