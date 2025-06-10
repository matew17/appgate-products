import { Directive, HostBinding, input } from '@angular/core';

export type ButtonTheme = 'primary' | 'secondary' | 'ghost';

@Directive({
  selector: '[appButton]',
})
export class Button {
  theme = input<ButtonTheme>('primary');

  @HostBinding('class.app-button')
  public readonly buttonClass = true;

  @HostBinding('class.app-button--primary')
  get isPrimary() {
    return this.theme() === 'primary';
  }

  @HostBinding('class.app-button--secondary')
  get isSecondary() {
    return this.theme() === 'secondary';
  }
}
