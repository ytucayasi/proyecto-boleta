import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        canActivate: [publicGuard],
        loadChildren: () => import('./features/auth/auth.routes')
            .then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                title: 'Dashboard',
                loadComponent: () => import('./features/dashboard/dashboard.component')
                    .then(m => m.DashboardComponent)
            },
            {
                path: 'viajes',
                title: 'Gestión de Viajes',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./features/viajes/pages/viajes-list/viajes-list.component')
                            .then(m => m.ViajesListComponent)
                    },
                    {
                        path: 'nuevo',
                        title: 'Nuevo Viaje',
                        loadComponent: () => import('./features/viajes/pages/viaje-form/viaje-form.component')
                            .then(m => m.ViajeFormComponent)
                    },
                    {
                        path: 'editar/:id',
                        title: 'Editar Viaje',
                        loadComponent: () => import('./features/viajes/pages/viaje-form/viaje-form.component')
                            .then(m => m.ViajeFormComponent)
                    }
                ]
            },
            {
                path: 'pasajes',
                title: 'Gestión de Pasajes',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./features/pasajes/pages/pasajes-list/pasajes-list.component')
                            .then(m => m.PasajesListComponent)
                    },
                    {
                        path: 'comprar',
                        title: 'Comprar Pasaje',
                        loadComponent: () => import('./features/pasajes/pages/pasaje-compra/pasaje-compra.component')
                            .then(m => m.PasajeCompraComponent)
                    },
                    {
                        path: 'buscar',
                        title: 'Buscar Pasajes',
                        loadComponent: () => import('./features/pasajes/pages/pasaje-busqueda/pasaje-busqueda.component')
                            .then(m => m.PasajeBusquedaComponent)
                    }
                ]
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        loadComponent: () => import('./shared/components/not-found/not-found.component')
            .then(m => m.NotFoundComponent)
    }
];
