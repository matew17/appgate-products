import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

import { Navigation } from './navigation';
import { NavItem } from './navitem.interface';

@Component({
  template: `
    <app-navigation [navItems]="testNavItems()">
      <div id="projected-content">Projected Content</div>
    </app-navigation>
  `,
  standalone: true,
  imports: [Navigation],
})
class TestHostComponent {
  testNavItems = signal<NavItem[]>([]);
}

describe('Navigation Component', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  const mockNavItems: NavItem[] = [
    { name: 'Home', url: '/home' },
    { name: 'Products', url: '/products' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideRouter([]), provideLocationMocks()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    const navInstance = fixture.debugElement.query(
      By.directive(Navigation)
    ).componentInstance;
    expect(navInstance).toBeTruthy();
  });

  it('should render the correct number of navigation items', () => {
    hostComponent.testNavItems.set(mockNavItems);
    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(By.css('.main-nav li'));
    expect(listItems.length).toBe(mockNavItems.length);
  });

  it('should display the correct name and URL for each navigation item', () => {
    hostComponent.testNavItems.set(mockNavItems);
    fixture.detectChanges();

    const anchorElements: HTMLAnchorElement[] = fixture.debugElement
      .queryAll(By.css('.main-nav li a'))
      .map((el) => el.nativeElement);

    expect(anchorElements.length).toBe(2);
    expect(anchorElements[0].textContent?.trim()).toBe('Home');
    expect(anchorElements[0].getAttribute('href')).toBe('/home');
    expect(anchorElements[1].textContent?.trim()).toBe('Products');
    expect(anchorElements[1].getAttribute('href')).toBe('/products');
  });

  it('should display the empty state message when navItems is an empty array', () => {
    hostComponent.testNavItems.set([]);
    fixture.detectChanges();

    const emptyStateElement = fixture.debugElement.query(
      By.css('.main-nav li a')
    );
    expect(emptyStateElement).not.toBeNull();
    expect(emptyStateElement.nativeElement.textContent?.trim()).toBe(
      'No items available'
    );
  });

  it('should correctly project content into the .right-content div', () => {
    hostComponent.testNavItems.set(mockNavItems);
    fixture.detectChanges();

    const projectedContent = fixture.debugElement.query(
      By.css('#projected-content')
    );
    expect(projectedContent).not.toBeNull();
    expect(projectedContent.nativeElement.textContent).toBe(
      'Projected Content'
    );
  });
});
