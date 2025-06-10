import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Spinner } from '@components/spinner/spinner';
import { Button } from '@directives/button';
import { ProductService } from '@features/products/services/product';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-create-update-product',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Spinner, Button],
  templateUrl: './create-update-product.html',
  styleUrl: './create-update-product.scss',
})
export class CreateUpdateProduct implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productForm!: FormGroup;

  mode = signal<'create' | 'edit'>('create');
  productId = signal<string | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    this.initializeForm();
    this.checkMode();
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();

      return;
    }

    this.isLoading.set(true);

    const productData = this.productForm.value;

    const operation =
      this.mode() === 'create'
        ? this.productService.createProduct(productData)
        : this.productService.updateProduct(this.productId()!, productData);

    operation.pipe(finalize(() => this.isLoading.set(false))).subscribe(() => {
      this.router.navigate(['/products']);
    });
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: [1, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['Electronics', Validators.required],
      image: [
        'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081',
        Validators.required,
      ],
    });
  }

  private checkMode(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.mode.set('edit');
      this.productId.set(id);
      this.loadProductData(id);
    }
  }

  private loadProductData(id: string): void {
    this.isLoading.set(true);

    this.productService
      .getProductById(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((product) => {
        if (product) {
          this.productForm.patchValue(product);
        } else {
          this.router.navigate(['/products']);
        }
      });
  }
}
