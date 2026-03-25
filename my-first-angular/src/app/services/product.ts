import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private products = [
    { id: 1, name: 'MacBook', price: 200000, inStock: true },
    { id: 2, name: 'iPhone', price: 120000, inStock: false },
    { id: 3, name: 'iPad', price: 80000, inStock: true },
  ];

  getProducts() {
    return this.products;
  }

  getInStockProducts() {
    return this.products.filter(p => p.inStock);
  }
}
