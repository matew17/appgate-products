import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@app/features/auth/services/auth';

@Component({
  selector: 'app-authorize',
  imports: [],
  templateUrl: './authorize.html',
  styleUrl: './authorize.scss',
})
export class Authorize implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.handleAuthCallback().subscribe((loginResponse) => {
      const returnUrl = loginResponse.userData?.returnUrl || '/products';

      this.router.navigateByUrl(returnUrl, { replaceUrl: true });
    });
  }
}
