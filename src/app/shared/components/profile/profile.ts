import { Component, computed, inject } from '@angular/core';
import { AuthService } from '@features/auth/services/auth';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  public authService = inject(AuthService);

  public email = computed(() => {
    const user = this.authService.userData();

    return user?.userData.email;
  });
}
