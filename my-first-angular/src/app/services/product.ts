import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  // 注入 HttpClient
  constructor(private http: HttpClient) {}
  // Observable 是 RxJS 的一部分，用於處理非同步資料流
  getUsers(): Observable<any[]> {
    // 回傳一個 [資料流]
    return this.http.get<any[]>(this.apiUrl);
  }

}
