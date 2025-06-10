import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateProduct } from './create-update-product';

describe('CreateUpdateProduct', () => {
  let component: CreateUpdateProduct;
  let fixture: ComponentFixture<CreateUpdateProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUpdateProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
