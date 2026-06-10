import { HttpInterceptorFn } from '@angular/common/http';

const authIgnorePattern = /\/api\/auth\/(?:login|signup)(?:\/)?$/;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (authIgnorePattern.test(req.url)) {
    return next(req);
  }

  const token = localStorage.getItem('token');
  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(cloned);
  }

  return next(req);
};
