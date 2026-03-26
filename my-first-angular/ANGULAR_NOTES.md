# Angular 學習筆記

> 基於 `my-first-angular` 專案整理，適合有 Java / Spring Boot 背景的人對照學習。

---

## 目錄

1. [Component 基礎](#1-component-基礎)
2. [Input / Output / EventEmitter](#2-input--output--eventemitter)
3. [Signal — 狀態管理](#3-signal--狀態管理)
4. [Lifecycle Hooks — 生命週期](#4-lifecycle-hooks--生命週期)
5. [Dependency Injection — 依賴注入](#5-dependency-injection--依賴注入)
6. [Service](#6-service)
7. [HttpClient + RxJS Observable](#7-httpclient--rxjs-observable)
8. [Routing — 路由](#8-routing--路由)
9. [Reactive Forms — 響應式表單](#9-reactive-forms--響應式表單)
10. [Template 語法](#10-template-語法)
11. [App 全域設定](#11-app-全域設定)

---

## 1. Component 基礎

Angular 的 Component 對應 Spring Boot 的 Controller + View 的概念，每個 Component 是一個獨立的 UI 單元。

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',       // HTML 標籤名稱，在 index.html 用 <app-root>
  imports: [],                // 這個 component 用到的其他 component 或模組
  templateUrl: './app.html',  // 對應的 HTML
  styleUrl: './app.css'       // 對應的 CSS
})
export class App {
  title = 'My App';
}
```

**對應關係**

| Angular | Spring Boot |
|---------|-------------|
| `@Component` | `@Controller` |
| `selector` | URL mapping |
| `templateUrl` | Thymeleaf / JSP View |
| `imports: []` | import statement |

---

## 2. Input / Output / EventEmitter

父子 Component 之間的資料傳遞。

### 父 → 子：`@Input()`

```typescript
// navbar.ts（子）
import { Component, Input } from '@angular/core';

@Component({ selector: 'app-navbar', ... })
export class Navbar {
  @Input() appName: string = '';  // 從父層接收資料
}
```

```html
<!-- app.html（父），傳值給子 -->
<app-navbar appName="Demo application" />
```

### 子 → 父：`@Output()` + `EventEmitter`

```typescript
// navbar.ts（子）
import { Component, Output, EventEmitter } from '@angular/core';

export class Navbar {
  @Output() menuClicked = new EventEmitter<string>();

  onMenuClick(page: string) {
    this.menuClicked.emit(page);  // 發事件給父層
  }
}
```

```html
<!-- app.html（父），監聽子層事件 -->
<app-navbar (menuClicked)="onMenuClicked($event)" />
```

```typescript
// app.ts（父），處理事件
onMenuClicked(page: string) {
  this.currentPage.set(page);
}
```

**對應關係**

| Angular | Spring Boot / Java |
|---------|-------------------|
| `@Input()` | 方法參數 |
| `@Output()` + `EventEmitter` | Callback / Observer pattern |
| `emit()` | 觸發事件 |
| `$event` | 事件帶的值 |

---

## 3. Signal — 狀態管理

Angular 17+ 的新狀態管理工具，讓 Angular 能精準偵測資料變化並更新畫面。

```typescript
import { signal } from '@angular/core';

// 建立 signal
isLoggedIn = signal(false);
users = signal<any[]>([]);
title = signal('Clark Liu Project');

// 讀取值（要加括號）
console.log(this.isLoggedIn());   // false

// 更新值：set（直接設定）
this.isLoggedIn.set(true);

// 更新值：update（基於舊值更新）
this.isLoggedIn.update(value => !value);
```

**在 Template 中使用（也要加括號）**

```html
<h1>{{ title() }}</h1>
<p>{{ isLoggedIn() ? 'ログイン中' : 'ログアウト' }}</p>
```

**何時使用 Signal**

| 情境 | 用 Signal |
|------|-----------|
| 非同步 API 回來的資料 | ✅ |
| 需要反映在畫面的狀態 | ✅ |
| 計數器、開關 | ✅ |
| 靜態不變的常數 | ❌（用 `readonly` 就好）|

---

## 4. Lifecycle Hooks — 生命週期

類似 Spring Boot 的 `@PostConstruct`，可以在特定時機執行邏輯。

```typescript
import { Component, OnInit } from '@angular/core';

export class App implements OnInit {

  constructor(private productService: ProductService) {
    // 1. 最早執行，適合同步初始化
    this.products = this.productService.getProducts();
  }

  ngOnInit() {
    // 2. Component 初始化完成後執行，適合 HTTP 呼叫
    this.productService.getUsers().subscribe({
      next: (data) => this.users.set(data),
      error: (err) => console.error(err)
    });
  }
}
```

**生命週期順序**

```
1. constructor     ← Component 物件被建立（同步初始化）
2. ngOnInit        ← 初始化完成（HTTP 呼叫放這裡）
3. 畫面渲染
4. ngOnDestroy     ← Component 被銷毀（清理資源）
```

**對應關係**

| Angular | Spring Boot |
|---------|-------------|
| `constructor` | `new` / 建構子 |
| `ngOnInit` | `@PostConstruct` |
| `ngOnDestroy` | `@PreDestroy` |

---

## 5. Dependency Injection — 依賴注入

和 Spring Boot 的 `@Autowired` 概念一樣，Angular 會自動注入需要的 Service。

```typescript
// app.ts
constructor(private productService: ProductService) {
  // Angular 自動注入 ProductService 的實例
}
```

**對應關係**

| Angular | Spring Boot |
|---------|-------------|
| `constructor(private service: MyService)` | `@Autowired MyService service` |
| `@Injectable({ providedIn: 'root' })` | `@Service` / `@Component` |
| Angular IoC Container | Spring IoC Container |

---

## 6. Service

將業務邏輯與資料存取抽離 Component，對應 Spring Boot 的 `@Service`。

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',   // 全域單例，對應 Spring 的 @Service
})
export class ProductService {

  private products = [
    { id: 1, name: 'MacBook', price: 200000, inStock: true },
  ];

  // 同步方法：直接回傳資料
  getProducts() {
    return this.products;
  }

  getInStockProducts() {
    return this.products.filter(p => p.inStock);
  }

  // 非同步方法：透過 HttpClient 呼叫 API
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
```

---

## 7. HttpClient + RxJS Observable

Angular 的 HTTP 呼叫方式，類似 Spring 的 `RestTemplate` / `WebClient`。

**設定（app.config.ts）**

```typescript
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),   // ← 必須加這行才能用 HttpClient
  ]
};
```

**Service 中回傳 Observable**

```typescript
getUsers(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl);  // 回傳資料流
}
```

**Component 中訂閱 Observable**

```typescript
ngOnInit() {
  this.productService.getUsers().subscribe({
    next: (data) => {
      this.users.set(data);       // 成功：更新 signal
    },
    error: (err) => {
      console.error(err);         // 失敗：處理錯誤
    }
  });
}
```

**對應關係**

| Angular (RxJS) | Spring Boot |
|----------------|-------------|
| `Observable<T>` | `Flux<T>` / `Mono<T>` (WebFlux) |
| `.subscribe()` | `.subscribe()` / `.block()` |
| `next` callback | `.doOnNext()` |
| `error` callback | `.doOnError()` |
| `HttpClient.get<T>()` | `RestTemplate.getForObject()` |

---

## 8. Routing — 路由

Angular 的前端路由，URL 改變但**不會真的發 HTTP 請求給伺服器**。

**定義路由（app.routes.ts）**

```typescript
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: Home },               // 首頁
  { path: 'about', component: About },         // /about
  { path: 'login', component: LoginComponent },// /login
  { path: '**', redirectTo: '' }               // 找不到 → 回首頁
];
```

**在 Template 中使用**

```html
<!-- 導航連結（不會重新載入頁面） -->
<a routerLink="/">ホーム</a>
<a routerLink="/about">について</a>

<!-- 路由對應的 Component 顯示在這裡 -->
<router-outlet />
```

**運作流程**

```
使用者點 <a routerLink="/about">
  ↓
Angular Router 攔截點擊（不發 HTTP 請求）
  ↓
去 app.routes.ts 找 { path: 'about', component: About }
  ↓
URL 變成 localhost:4200/about
  ↓
<router-outlet /> 的位置換成 About component
  ↓
畫面更新，頁面沒有重新載入
```

**必要設定**

```typescript
// app.config.ts
import { provideRouter } from '@angular/router';
providers: [provideRouter(routes)]

// component 需要 import RouterOutlet 和 RouterLink
imports: [RouterOutlet, RouterLink]
```

---

## 9. Reactive Forms — 響應式表單

Angular 的表單驗證方案，類似 Spring Boot 的 `@Valid` + Bean Validation。

**Component**

```typescript
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],   // ← 必須 import
  ...
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      // { email: '...', password: '...' }
    }
  }
}
```

**Template**

```html
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">

  <input type="email" formControlName="email" />

  <!-- 錯誤訊息：errors?.['xxx'] + touched（使用者碰過才顯示） -->
  @if (loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched) {
    <p>メールアドレスは必須です</p>
  }
  @if (loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched) {
    <p>正しいメールアドレスを入力してください</p>
  }

  <input type="password" formControlName="password" />

  @if (loginForm.get('password')?.errors?.['minlength'] && loginForm.get('password')?.touched) {
    <p>パスワードは6文字以上です</p>
  }

  <!-- 表單無效時 disabled -->
  <button type="submit" [disabled]="loginForm.invalid">ログイン</button>

</form>
```

**對應關係**

| Angular | Spring Boot |
|---------|-------------|
| `FormBuilder.group({})` | `@Valid` + DTO class |
| `Validators.required` | `@NotNull` |
| `Validators.email` | `@Email` |
| `Validators.minLength(6)` | `@Size(min=6)` |
| `loginForm.valid` | `BindingResult.hasErrors()` |
| `.touched` | 使用者互動後才顯示錯誤 |

---

## 10. Template 語法

### 資料綁定

```html
<!-- Interpolation：顯示值 -->
{{ title() }}

<!-- Property Binding：動態設定屬性 -->
<button [disabled]="loginForm.invalid">Submit</button>

<!-- Event Binding：監聽事件 -->
<button (click)="toggleLogin()">Click</button>

<!-- Two-way Binding（需要 FormsModule）-->
<input [(ngModel)]="name" />
```

### 控制流程（Angular 17+ 新語法）

```html
<!-- 條件顯示 -->
@if (isLoggedIn()) {
  <p>ログイン中</p>
} @else {
  <p>ログインしてください</p>
}

<!-- 迴圈（track 用來識別元素，效能優化） -->
@for (product of products; track product.id) {
  <li>{{ product.name }}</li>
}
```

---

## 11. App 全域設定

**app.config.ts** — 全域 providers，類似 Spring Boot 的 `@Configuration`。

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),    // 啟用路由
    provideHttpClient(),      // 啟用 HttpClient
  ]
};
```

---

## 下一步學習方向

- **Route Guard** — 保護需要登入才能進入的頁面（`canActivate`）
- **`inject()` 函式** — Angular 17+ 的現代 DI 寫法，替代 constructor injection
- **`computed()`** — 從 signal 衍生的計算值（類似 computed property）
- **`ActivatedRoute`** — 從 URL 拿路由參數（例如 `/product/:id`）
- **`pipe()` + RxJS operators** — `map`, `filter`, `switchMap` 等資料流操作
