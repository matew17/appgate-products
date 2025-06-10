import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { finalize } from 'rxjs';

import { Button } from '@directives/button';
import { ModalService } from '@services/modal/modal';
import { Product } from '@features/products/models/product.interface';
import { ProductCard } from '@features/products/components/product-card/product-card';
import { ProductService } from '@features/products/services/product';
import { Spinner } from '@components/spinner/spinner';

@Component({
  selector: 'app-list-products',
  imports: [Spinner, Button, ProductCard, RouterLink],
  templateUrl: './list-products.html',
  styleUrl: './list-products.scss',
})
export class ListProducts implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private modalService = inject(ModalService);

  products = signal<Product[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productService
      .getProducts()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.products.set(data);
        },
        error: () => {
          this.error.set('Failed to load products. Please try again later.');
        },
      });
  }

  handleEdit(product: Product): void {
    this.router.navigate(['/products', 'edit', product.id]);
  }

  async handleDelete(product: Product): Promise<void> {
    const confirmed = await this.modalService.open({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete "${product.title}"? This action cannot be undone.`,
    });

    if (confirmed) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => console.error('Error deleting product:', err),
      });
    }
  }
}
