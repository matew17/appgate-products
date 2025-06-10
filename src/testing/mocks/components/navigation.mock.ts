import { Component, input } from '@angular/core';
import { NavItem } from '@components/navigation/navitem.interface';

@Component({
  selector: 'app-navigation',
  standalone: true,
  template: `
    <div class="mock-nav">
      <ng-content></ng-content>
    </div>
  `,
})
export class MockNavigationComponent {
  navItems = input.required<NavItem[]>();
}
