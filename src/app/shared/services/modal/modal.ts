import {
  ComponentRef,
  EnvironmentInjector,
  inject,
  Injectable,
  ViewContainerRef,
} from '@angular/core';

import { ModalConfig } from './modal-config.interface';
import { ConfirmationModal } from '@components/confirmation-modal/confirmation-modal';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private injector = inject(EnvironmentInjector);
  private hostViewContainer?: ViewContainerRef;

  registerHostViewContainer(vcr: ViewContainerRef): void {
    this.hostViewContainer = vcr;
  }

  open(config: ModalConfig): Promise<boolean> {
    if (!this.hostViewContainer) {
      throw new Error('No host view container registered for ModalService.');
    }

    this.hostViewContainer.clear();

    const modalComponentRef: ComponentRef<ConfirmationModal> =
      this.hostViewContainer.createComponent(ConfirmationModal, {
        injector: this.injector,
      });

    modalComponentRef.setInput('title', config.title);
    modalComponentRef.setInput('message', config.message);

    return new Promise<boolean>((resolve) => {
      const confirmSubscription = modalComponentRef.instance.confirm.subscribe(
        () => {
          resolve(true);
          confirmSubscription.unsubscribe();
          cancelSubscription.unsubscribe();
          modalComponentRef.destroy();
        }
      );

      const cancelSubscription = modalComponentRef.instance.cancel.subscribe(
        () => {
          resolve(false);
          confirmSubscription.unsubscribe();
          cancelSubscription.unsubscribe();
          modalComponentRef.destroy();
        }
      );
    });
  }
}
