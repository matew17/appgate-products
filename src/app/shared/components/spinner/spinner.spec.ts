import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Spinner } from './spinner';
import { Component, signal } from '@angular/core';

@Component({
  template: `<app-spinner [size]="testSize()"></app-spinner>`,
  standalone: true,
  imports: [Spinner],
})
export class HostSpinnerMock {
  testSize = signal(36);
}

describe('Spinner Component', () => {
  let fixture: ComponentFixture<HostSpinnerMock>;
  let hostComponent: HostSpinnerMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostSpinnerMock],
    }).compileComponents();

    fixture = TestBed.createComponent(HostSpinnerMock);
    hostComponent = fixture.componentInstance;
  });

  const getSpinnerElement = (): HTMLElement => {
    fixture.detectChanges();
    return fixture.debugElement.query(By.css('.spinner')).nativeElement;
  };

  it('should create the component successfully', () => {
    const spinnerInstance = fixture.debugElement.query(
      By.directive(Spinner)
    ).componentInstance;
    expect(spinnerInstance).toBeTruthy();
  });

  it('should render with the default size (36px) if no input is provided', () => {
    const spinnerElement = getSpinnerElement();

    expect(spinnerElement.style.width).toBe('36px');
    expect(spinnerElement.style.height).toBe('36px');
  });

  it('should render with a custom size when the input is set', () => {
    hostComponent.testSize.set(100);
    const spinnerElement = getSpinnerElement();

    expect(spinnerElement.style.width).toBe('100px');
    expect(spinnerElement.style.height).toBe('100px');
  });

  it('should update its size when the input value changes dynamically', () => {
    let spinnerElement = getSpinnerElement();
    expect(spinnerElement.style.width).toBe('36px');

    hostComponent.testSize.set(50);
    spinnerElement = getSpinnerElement();

    expect(spinnerElement.style.width).toBe('50px');
    expect(spinnerElement.style.height).toBe('50px');
  });
});
