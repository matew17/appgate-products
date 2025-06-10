import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ConfirmationModal } from './confirmation-modal';

@Component({
  template: `
    <app-confirmation-modal
      [title]="testTitle()"
      [message]="testMessage()"
      (confirm)="onTestConfirm()"
      (cancel)="onTestCancel()"
    />
  `,
  standalone: true,
  imports: [ConfirmationModal],
})
class TestHostComponent {
  testTitle = signal('Default Title');
  testMessage = signal('Default Message');

  onTestConfirm() {}
  onTestCancel() {}
}

describe('ConfirmationModal Component', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    const modalInstance = fixture.debugElement.query(
      By.directive(ConfirmationModal)
    ).componentInstance;
    expect(modalInstance).toBeTruthy();
  });

  it('should display the title and message from inputs', () => {
    const title = 'Test Title';
    const message = 'Are you sure about this?';
    hostComponent.testTitle.set(title);
    hostComponent.testMessage.set(message);
    fixture.detectChanges();

    const titleElement: HTMLElement = fixture.debugElement.query(
      By.css('.modal-title')
    ).nativeElement;
    const messageElement: HTMLElement = fixture.debugElement.query(
      By.css('.modal-message')
    ).nativeElement;

    expect(titleElement.textContent).toBe(title);
    expect(messageElement.textContent).toBe(message);
  });
});
