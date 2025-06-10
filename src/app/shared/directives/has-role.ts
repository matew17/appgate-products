import {
  Directive,
  inject,
  TemplateRef,
  ViewContainerRef,
  Input,
} from '@angular/core';

import { AuthService } from '@app/features/auth/services/auth/auth';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appHasRole]',
})
export class HasRole {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  private requiredRoles: string | string[] = [];
  private subscription?: Subscription;

  @Input({ alias: 'appHasRole', required: true })
  set appHasRole(roles: string | string[]) {
    this.requiredRoles = roles;
  }

  ngOnInit(): void {
    // This is necessary to update the view when the roles change, as signals are not sully supported by auth library.
    this.subscription = this.authService.getUserGroups().subscribe((groups) => {
      this.updateView(groups || []);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateView(userRoles: string[]): void {
    const requiredRolesArray = Array.isArray(this.requiredRoles)
      ? this.requiredRoles
      : [this.requiredRoles];

    const hasPermission = userRoles.some((role) =>
      requiredRolesArray.includes(role)
    );

    this.viewContainer.clear();

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
