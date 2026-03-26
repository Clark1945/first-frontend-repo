// 從 Angular 核心引入 Component 和 signal
import { Component, signal, OnInit } from '@angular/core';
// 引入 Router（用來做頁面導航）
import { RouterOutlet, RouterLink  } from '@angular/router';
// 引入 自定義 Components
import { ProductService } from './services/product'
import { Navbar } from './components/navbar/navbar';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  // 這個 component 的 HTML 標籤名稱 index.html 裡的 <app-root> 就是這個
  selector: 'app-root',
  // 這個 component 用到哪些其他 component 或模組
  imports: [RouterOutlet, Navbar, RouterLink,ReactiveFormsModule],
  // 對應的 HTML 檔案
  templateUrl: './app.html',
  // 對應的 CSS 檔案
  styleUrl: './app.css'
})
export class App implements OnInit {
  // signal 是 Angular 21 的新狀態管理方式 Angular 17+ 的狀態管理工具，讓 Angular 能精準偵測資料變化並更新畫面。

  protected readonly title = signal('Clark Liu Project');

// // 用 Signal 的情況
// // ✅ 非同步拿回來的資料（API）
//   users = signal<any[]>([]);
//
// // ✅ 會被改變且需要反映在畫面的狀態
//   isLoggedIn = signal(false);
//   currentPage = signal('home');
//
// // ✅ 計數器、開關之類的
//   count = signal(0);
//   isOpen = signal(false);

  isLoggedIn = signal(false);
  toggleLogin() {
    this.isLoggedIn.update(value => !value);
  }

  currentPage = signal('home');
  onMenuClicked(page: string) {
    this.currentPage.set(page);
  }

  products: any[] = [];
  // 依賴注入，跟 Spring Boot 的 @Autowired 一樣
  constructor(private productService: ProductService) {
    this.products = this.productService.getProducts();
  }

  // ngOnInit 的執行時機
  // Angular Component 的生命週期：
  // 1. constructor    ← 最早，Component 物件被建立
  // 2. ngOnInit      ← 第二，Component 初始化完成
  // 3. 畫面渲染
  // 4. ngOnDestroy   ← 最後，Component 被銷毀

  // signal 內建通知機制
  // Angular 的 Change Detection 對陣列重新賦值不靈敏，它沒有感知到 users 變了，所以畫面不更新。
  users = signal<any[]>([]);  // ← 改成 signal
  // 像是Spring Boot的@PostConstruct
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
