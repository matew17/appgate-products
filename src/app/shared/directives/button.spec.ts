import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Button, ButtonTheme } from './button';

@Component({
  template: `<button appButton [theme]="testTheme()"></button>`,
  standalone: true,
  imports: [Button],
})
class TestHostComponent {
  testTheme = signal<ButtonTheme>('primary');
}

describe('Button Directive', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
  });

  const getButtonClasses = (): DOMTokenList => {
    fixture.detectChanges();
    return fixture.debugElement.query(By.css('button')).nativeElement.classList;
  };

  it('should apply the base "app-button" class', () => {
    const classList = getButtonClasses();
    expect(classList.contains('app-button')).toBeTrue();
  });

  it('should apply the "app-button--primary" class by default', () => {
    const classList = getButtonClasses();
    expect(classList.contains('app-button--primary')).toBeTrue();
    expect(classList.contains('app-button--secondary')).toBeFalse();
  });

  it('should apply the "app-button--primary" class when theme is "primary"', () => {
    hostComponent.testTheme.set('primary');
    const classList = getButtonClasses();
    expect(classList.contains('app-button--primary')).toBeTrue();
    expect(classList.contains('app-button--secondary')).toBeFalse();
  });

  it('should apply the "app-button--secondary" class when theme is "secondary"', () => {
    hostComponent.testTheme.set('secondary');
    const classList = getButtonClasses();
    expect(classList.contains('app-button--secondary')).toBeTrue();
    expect(classList.contains('app-button--primary')).toBeFalse();
  });

  it('should not apply theme classes for an unknown theme like "ghost"', () => {
    hostComponent.testTheme.set('ghost');
    const classList = getButtonClasses();
    expect(classList.contains('app-button--primary')).toBeFalse();
    expect(classList.contains('app-button--secondary')).toBeFalse();
  });

  it('should dynamically change classes when the theme input changes', () => {
    let classList = getButtonClasses();
    expect(classList.contains('app-button--primary')).toBeTrue();

    hostComponent.testTheme.set('secondary');
    classList = getButtonClasses();
    expect(classList.contains('app-button--primary')).toBeFalse();
    expect(classList.contains('app-button--secondary')).toBeTrue();
  });
});
