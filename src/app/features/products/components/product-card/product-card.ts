import { Component, input, output } from '@angular/core';

import { Button } from '@directives/button';
import { Product } from '@features/products/models/product.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [Button, CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  product = input.required<Product>();

  edit = output<Product>();
  delete = output<Product>();

  onEdit(): void {
    this.edit.emit(this.product());
  }

  onDelete(): void {
    this.delete.emit(this.product());
  }
}
