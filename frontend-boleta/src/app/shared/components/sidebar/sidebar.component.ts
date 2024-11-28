import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="bg-gray-800 w-64 min-h-screen flex flex-col">
      <div class="flex items-center justify-center h-16 bg-gray-900">
        <span class="text-white text-lg font-semibold">Panel de Control</span>
      </div>
      
      <nav class="flex-1 px-2 py-4">
        <a routerLink="/dashboard" 
           routerLinkActive="bg-gray-900 text-white"
           class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg mb-2">
          <span>Dashboard</span>
        </a>
        
        <a routerLink="/viajes" 
           routerLinkActive="bg-gray-900 text-white"
           class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg mb-2">
          <span>Viajes</span>
        </a>
        
        <a routerLink="/pasajes" 
           routerLinkActive="bg-gray-900 text-white"
           class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg mb-2">
          <span>Pasajes</span>
        </a>

        <div class="pt-4 mt-4 border-t border-gray-700">
          <button (click)="logout()" 
                  class="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg">
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </nav>
    </aside>
  `
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}