import { Component, signal } from '@angular/core'; // 從 Angular 核心引入 Component 和 signal
import { RouterOutlet } from '@angular/router'; // 引入 Router（用來做頁面導航）

import { Navbar } from './components/navbar/navbar';


@Component({ 
  selector: 'app-root', // 這個 component 的 HTML 標籤名稱 index.html 裡的 <app-root> 就是這個
  imports: [RouterOutlet, Navbar], // 這個 component 用到哪些其他 component 或模組
  templateUrl: './app.html',  // 對應的 HTML 檔案
  styleUrl: './app.css' // 對應的 CSS 檔案
})
export class App {
  protected readonly title = signal('Clark Liu Project'); // signal 是 Angular 21 的新狀態管理方式 類似 React 的 useState


  products = [
    { id: 1, name: 'MacBook', price: 200000 },
    { id: 2, name: 'iPhone', price: 120000 },
    { id: 3, name: 'iPad', price: 80000 },
  ];

  isLoggedIn = false;

  toggleLogin() {
    this.isLoggedIn = !this.isLoggedIn;
  }

  currentPage = 'home';

  onMenuClicked(page: string) {
    this.currentPage = page;
  }
}
