import { Component, signal, OnInit } from '@angular/core'; // 從 Angular 核心引入 Component 和 signal
import { RouterOutlet, RouterLink  } from '@angular/router'; // 引入 Router（用來做頁面導航）

import { ProductService } from './services/product'
import { Navbar } from './components/navbar/navbar';
import { ReactiveFormsModule } from '@angular/forms';

@Component({ 
  selector: 'app-root', // 這個 component 的 HTML 標籤名稱 index.html 裡的 <app-root> 就是這個
  imports: [RouterOutlet, Navbar, RouterLink,ReactiveFormsModule], // 這個 component 用到哪些其他 component 或模組
  templateUrl: './app.html',  // 對應的 HTML 檔案
  styleUrl: './app.css' // 對應的 CSS 檔案
})
export class App implements OnInit {
  protected readonly title = signal('Clark Liu Project'); // signal 是 Angular 21 的新狀態管理方式 類似 React 的 useState

  isLoggedIn = false;
  toggleLogin() {
    this.isLoggedIn = !this.isLoggedIn;
  }

  currentPage = 'home';
  onMenuClicked(page: string) {
    this.currentPage = page;
  }

  products: any[] = [];
  
  // 依賴注入，跟 Spring Boot 的 @Autowired 一樣
  constructor(private productService: ProductService) {
    this.products = this.productService.getProducts();
  }

  // // users: any[] = [];
  // users = signal<any[]>([]);
  // // OnInit：Component 載入完成後執行
  // // 跟 Spring Boot 的 @PostConstruct 一樣
  // ngOnInit() {
  //   this.productService.getUsers().subscribe({
  //     next: (data) => {
  //       // 成功拿到資料
  //       console.log(data);
  //       this.users = data;
  //     },
  //     error: (err) => {
  //       // 發生錯誤
  //       console.error(err);
  //     },
  //     complete: () => {
  //       // 資料流結束（HTTP 請求完成後自動呼叫）
  //       console.log('完了！');
  //     }
  //   });
  // }

  // signal 內建通知機制
  // Angular 的 Change Detection 對陣列重新賦值不靈敏，它沒有感知到 users 變了，所以畫面不更新。
  users = signal<any[]>([]);  // ← 改成 signal

  ngOnInit() {
    this.productService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);  // ← set() 更新 signal
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
