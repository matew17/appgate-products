import { Product } from './product.interface';

export interface LocalProductState {
  additions: Product[];
  modifications: { [id: string]: Partial<Product> };
  deletions: string[];
}
