import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { finalize } from 'rxjs';

import { Product } from '@features/products/models/product.interface';
import { ProductService } from '@features/products/services/product';
import { Button } from '@directives/button';
import { Spinner } from '@components/spinner/spinner';
import { HasRole } from '@directives/has-role';

@Component({
  selector: 'app-product-detail',
  imports: [Spinner, Button, RouterLink, CurrencyPipe, HasRole],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  public product = signal<Product | undefined>(undefined);
  public isLoading = signal(true);
  public error = signal<string | null>(null);

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.productService
        .getProductById(productId)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (productData) => {
            if (productData) {
              this.product.set(productData);
            } else {
              this.error.set(`Product with ID ${productId} not found.`);
            }
          },
          error: (err) => {
            this.error.set('Failed to load product details.');
            console.error(err);
          },
        });
    } else {
      this.error.set('No product ID provided.');
      this.isLoading.set(false);
    }
  }
}
