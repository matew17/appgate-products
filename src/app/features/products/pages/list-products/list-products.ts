import { Component, inject, OnInit, signal } from '@angular/core';

import { Product } from '@features/products/models/product.interface';
import { ProductService } from '@features/products/services/product';
import { Spinner } from '@components/spinner/spinner';
import { Button } from '@directives/button';
import { ProductCard } from '@features/products/components/product-card/product-card';

@Component({
  selector: 'app-list-products',
  imports: [Spinner, Button, ProductCard],
  templateUrl: './list-products.html',
  styleUrl: './list-products.scss',
})
export class ListProducts implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load products. Please try again later.');

        this.isLoading.set(false);
      },
    });
  }

  handleEdit(product: Product): void {
    // TODO: Navigate to the edit route: this.router.navigate(['/products/edit', product.id]);
  }

  handleDelete(product: Product): void {
    // TODO: Implement delete logic (e.g., show confirmation modal, call service)
  }
}
