import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. 從 localStorage 拿 Token
  const token = localStorage.getItem('token');

  // 2. 如果有 Token，幫請求加上 Authorization header
  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedReq).pipe(
      catchError(err => {
        if (err.status === 401) {
          // Token 過期，清掉並導向登入頁
          localStorage.removeItem('token');
          console.log('ログインが必要です');
        }
        return throwError(() => err);
      })
    );  // 送出修改後的請求
  }

  return next(req);
};
