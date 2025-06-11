import { Component, input, output } from '@angular/core';
import { Product } from '@features/products/models/product.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  template: '',
})
export class MockProductCard {
  product = input.required<Product>();
  edit = output<Product>();
  delete = output<Product>();
}
