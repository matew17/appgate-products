import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { ProductCard } from './product-card';
import { Product } from '@features/products/models/product.interface';
import { HasRole } from '@directives/has-role';
import { MockHasRole } from '@mocks/directives/has-role.mock';

const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  price: 99.99,
  category: 'electronics',
  description: 'A product for testing.',
  image: 'https://fakeimg.pl/300/',
  rating: { rate: 4.5, count: 100 },
};

@Component({
  template: `
    <app-product-card
      [product]="productSignal()"
      (edit)="onEdit($event)"
      (delete)="onDelete($event)"
    />
  `,
  standalone: true,
  imports: [ProductCard],
})
class TestHostComponent {
  productSignal = signal<Product | undefined>(undefined);
  onEdit(product: Product) {}
  onDelete(product: Product) {}
}

describe('ProductCard Component', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideRouter([])],
    })
      .overrideComponent(ProductCard, {
        remove: { imports: [HasRole] },
        add: { imports: [MockHasRole] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
  });

  it('should create the component', () => {
    hostComponent.productSignal.set(mockProduct);
    fixture.detectChanges();
    const cardInstance = fixture.debugElement.query(By.directive(ProductCard));
    expect(cardInstance).toBeTruthy();
  });

  it('should not render the card if product input is not provided', () => {
    hostComponent.productSignal.set(undefined);
    fixture.detectChanges();
    const articleElement = fixture.debugElement.query(By.css('.product-card'));
    expect(articleElement).toBeNull();
  });

  it('should display the product title, category, and price correctly', () => {
    hostComponent.productSignal.set(mockProduct);
    fixture.detectChanges();

    const titleEl: HTMLElement = fixture.debugElement.query(
      By.css('.card-title')
    ).nativeElement;
    const categoryEl: HTMLElement = fixture.debugElement.query(
      By.css('.card-category')
    ).nativeElement;
    const priceEl: HTMLElement = fixture.debugElement.query(
      By.css('.card-price')
    ).nativeElement;

    expect(titleEl.textContent).toBe(mockProduct.title);
    expect(categoryEl.textContent).toBe(mockProduct.category);
    expect(priceEl.textContent).toContain('$99.99');
  });

  it('should set the correct routerLink for the main card link', () => {
    hostComponent.productSignal.set(mockProduct);
    fixture.detectChanges();
    const linkEl: HTMLAnchorElement = fixture.debugElement.query(
      By.css('.card-link')
    ).nativeElement;
    expect(linkEl.getAttribute('href')).toBe(`/products/${mockProduct.id}`);
  });
});
