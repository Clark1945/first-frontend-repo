import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: Home },        // 首頁
  { path: 'about', component: About },  // /about 頁面
  { path: 'login', component: LoginComponent },  // /login 頁面
  { path: '**', redirectTo: '' }        // 找不到就回首頁
];
