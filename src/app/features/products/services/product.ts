import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import { Product } from '@features/products/models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'https://fakestoreapi.com/products';

  constructor() {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  createProduct(product: Omit<Product, 'id' | 'rating'>): Observable<Product> {
    // TODO: Implement later
    return this.http
      .post<Product>(this.apiUrl, product)
      .pipe(catchError(this.handleError));
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    // TODO: Implement later
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .put<Product>(url, product)
      .pipe(catchError(this.handleError));
  }

  deleteProduct(id: string): Observable<void> {
    // TODO: Implement later
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }

    console.error(errorMessage);

    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
