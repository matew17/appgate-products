import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appButton]',
})
export class Button {
  @HostBinding('class.app-button')
  public readonly buttonClass = true;

  constructor() {}
}
