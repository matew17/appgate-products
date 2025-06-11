import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ProductService } from './product';
import { environment } from '@env/environment';
import { Product } from '@features/products/models/product.interface';
import { LocalProductState } from '@features/products/models/localproduct.interface';
import { provideHttpClient } from '@angular/common/http';

const MOCK_API_PRODUCTS: any[] = [
  { id: 1, title: 'API Product 1', price: 100 },
  { id: 2, title: 'API Product 2', price: 200 },
];

const MOCK_LOCAL_STATE: LocalProductState = {
  additions: [
    {
      id: 'local-uuid-1',
      title: 'Local Product 1',
      price: 300,
      category: 'local',
      description: '',
      image: '',
      rating: { rate: 0, count: 0 },
    },
  ],
  modifications: { '2': { price: 250 } },
  deletions: ['1'],
};

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;
  let localStorageStore: { [key: string]: string } = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);

    spyOn(localStorage, 'getItem').and.callFake(
      (key: string) => localStorageStore[key] || null
    );
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string) => {
        localStorageStore[key] = value;
      }
    );
    spyOn(localStorage, 'clear').and.callFake(() => {
      localStorageStore = {};
    });
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should fetch from API and merge with local state', (done) => {
      localStorageStore['app_product_state'] = JSON.stringify(MOCK_LOCAL_STATE);

      service.getProducts().subscribe((products) => {
        expect(products.length).toBe(2);

        const product1 = products.find((p) => p.id === '1');
        expect(product1).toBeUndefined();

        const product2 = products.find((p) => p.id === '2');
        expect(product2).toBeDefined();
        expect(product2?.price).toBe(250);

        const localProduct = products.find((p) => p.id === 'local-uuid-1');
        expect(localProduct).toBeDefined();
        expect(localProduct?.title).toBe('Local Product 1');

        done();
      });

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/products`
      );
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_API_PRODUCTS);
    });
  });

  describe('createProduct', () => {
    it('should add a new product to the local state additions', (done) => {
      const newProductData = {
        title: 'New Gadget',
        price: 50,
        category: 'gadgets',
        description: 'new',
        image: '',
      };
      const mockUuid = 'generated-uuid-123-123-123';
      spyOn(crypto, 'randomUUID').and.returnValue(mockUuid);

      service.createProduct(newProductData).subscribe((createdProduct) => {
        expect(createdProduct.id).toBe(mockUuid);
        expect(createdProduct.title).toBe('New Gadget');

        const localState = JSON.parse(localStorageStore['app_product_state']);
        expect(localState.additions.length).toBe(1);
        expect(localState.additions[0].id).toBe(mockUuid);
        done();
      });
    });
  });

  describe('updateProduct', () => {
    it('should add a modification for an API product', (done) => {
      localStorageStore['app_product_state'] = JSON.stringify({
        additions: [],
        modifications: {},
        deletions: [],
      });

      service.updateProduct('2', { price: 299 }).subscribe(() => {
        const localState = JSON.parse(localStorageStore['app_product_state']);
        expect(localState.modifications['2']).toBeDefined();
        expect(localState.modifications['2'].price).toBe(299);
        done();
      });
    });

    it('should update a product directly in the additions array', (done) => {
      const localProduct: Product = {
        id: 'local-1',
        title: 'Local Item',
        price: 10,
        category: '',
        description: '',
        image: '',
        rating: { rate: 0, count: 0 },
      };
      localStorageStore['app_product_state'] = JSON.stringify({
        additions: [localProduct],
        modifications: {},
        deletions: [],
      });

      service.updateProduct('local-1', { price: 15 }).subscribe(() => {
        const localState = JSON.parse(localStorageStore['app_product_state']);
        expect(localState.additions[0].price).toBe(15);
        done();
      });
    });
  });

  describe('deleteProduct', () => {
    it('should add an API product ID to the deletions array', (done) => {
      localStorageStore['app_product_state'] = JSON.stringify({
        additions: [],
        modifications: {},
        deletions: [],
      });

      service.deleteProduct('1').subscribe(() => {
        const localState = JSON.parse(localStorageStore['app_product_state']);
        expect(localState.deletions).toEqual(['1']);
        done();
      });
    });

    it('should remove a local product from the additions array', (done) => {
      const localProduct: Product = {
        id: 'local-to-delete',
        title: 'To Delete',
        price: 10,
        category: '',
        description: '',
        image: '',
        rating: { rate: 0, count: 0 },
      };
      localStorageStore['app_product_state'] = JSON.stringify({
        additions: [localProduct],
        modifications: {},
        deletions: [],
      });

      service.deleteProduct('local-to-delete').subscribe(() => {
        const localState = JSON.parse(localStorageStore['app_product_state']);
        expect(localState.additions.length).toBe(0);
        done();
      });
    });
  });
});
