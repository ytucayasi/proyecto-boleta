// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const token = authService.getToken();

    console.log('Token in interceptor:', token); // Para debug

    if (token) {
        const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        console.log('Request headers:', cloned.headers.get('Authorization')); // Para debug

        return next(cloned).pipe(
            catchError(error => {
                if (error.status === 401) {
                    authService.logout();
                    router.navigate(['/auth/login']);
                }
                return throwError(() => error);
            })
        );
    }
    return next(req);
};