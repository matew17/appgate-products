import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, map, Observable, of, throwError } from 'rxjs';

import { Product } from '@features/products/models/product.interface';
import { LocalProductState } from '@features/products/models/localproduct.interface';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;

  private readonly localStorageKey = 'app_product_state';

  getProducts(): Observable<Product[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((apiProducts) => {
        const typedApiProducts: Product[] = apiProducts.map((p) => ({
          ...p,
          id: String(p.id), // Casting to string to match the type of the id in the current models.
        }));

        const localState = this.getLocalState();

        const productsWithoutDeletions = typedApiProducts.filter(
          (p) => !localState.deletions.includes(p.id)
        );

        const productsWithModifications = productsWithoutDeletions.map((p) => {
          const modifiedFields = localState.modifications[p.id];
          return modifiedFields ? { ...p, ...modifiedFields } : p;
        });

        return [...localState.additions, ...productsWithModifications];
      }),
      catchError(this.handleError)
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map((products) => products.find((p) => p.id === id))
    );
  }

  createProduct(
    productData: Omit<Product, 'id' | 'rating'>
  ): Observable<Product> {
    const localState = this.getLocalState();

    const newProduct: Product = {
      ...productData,
      id: crypto.randomUUID(),
      rating: { rate: 0, count: 0 },
    };

    localState.additions.push(newProduct);

    this.saveLocalState(localState);

    return of(newProduct);
  }

  updateProduct(
    id: string,
    productUpdate: Partial<Product>
  ): Observable<Product> {
    const localState = this.getLocalState();
    let updatedProduct: Product | undefined;

    const productIndexInAdditions = localState.additions.findIndex(
      (p) => p.id === id
    );

    if (productIndexInAdditions > -1) {
      localState.additions[productIndexInAdditions] = {
        ...localState.additions[productIndexInAdditions],
        ...productUpdate,
      };
      updatedProduct = localState.additions[productIndexInAdditions];
    } else {
      localState.modifications[id] = {
        ...(localState.modifications[id] || {}),
        ...productUpdate,
      };
      updatedProduct = localState.modifications[id] as Product;
    }

    this.saveLocalState(localState);

    if (!updatedProduct) {
      return throwError(() => new Error('Product not found for update.'));
    }

    return of(updatedProduct);
  }

  deleteProduct(id: string): Observable<void> {
    const localState = this.getLocalState();
    const initialAdditionsCount = localState.additions.length;

    localState.additions = localState.additions.filter((p) => p.id !== id);

    if (localState.additions.length === initialAdditionsCount) {
      delete localState.modifications[id];

      if (!localState.deletions.includes(id)) {
        localState.deletions.push(id);
      }
    }

    this.saveLocalState(localState);

    return of(undefined);
  }

  private getLocalState(): LocalProductState {
    try {
      const stateJSON = localStorage.getItem(this.localStorageKey);
      if (stateJSON) {
        return JSON.parse(stateJSON);
      }
    } catch (e) {
      console.error('Error reading from localStorage', e);
    }

    return { additions: [], modifications: {}, deletions: [] };
  }

  private saveLocalState(state: LocalProductState): void {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
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
