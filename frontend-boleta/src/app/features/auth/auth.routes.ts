import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        title: 'Iniciar Sesión',
        loadComponent: () => import('./pages/login/login.component')
            .then(m => m.LoginComponent)
    },
    {
        path: 'registro',
        title: 'Registro de Usuario',
        loadComponent: () => import('./pages/registro/registro.component')
            .then(m => m.RegistroComponent)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
