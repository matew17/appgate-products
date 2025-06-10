import { Component, input, output } from '@angular/core';

import { Button } from '@directives/button';

@Component({
  selector: 'app-confirmation-modal',
  imports: [Button],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.scss',
})
export class ConfirmationModal {
  title = input.required<string>();
  message = input.required<string>();

  confirm = output<void>();
  cancel = output<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
