import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class MockProductService {
  getProducts = jasmine.createSpy('getProducts').and.returnValue(of([]));
  deleteProduct = jasmine
    .createSpy('deleteProduct')
    .and.returnValue(of(undefined));
  getProductById = jasmine
    .createSpy('getProductById')
    .and.returnValue(of(null));
  createProduct = jasmine
    .createSpy('createProduct')
    .and.returnValue(of({ id: 'new-1' }));
  updateProduct = jasmine
    .createSpy('updateProduct')
    .and.returnValue(of({ id: 'updated-1' }));
}
