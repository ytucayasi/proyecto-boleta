import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="min-h-screen flex">
      <!-- Sidebar -->
      <app-sidebar />
      
      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top Navigation -->
        <header class="bg-white shadow">
          <div class="px-4 py-4">
            <h2 class="text-xl font-semibold text-gray-800">Sistema de Venta de Pasajes</h2>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-auto bg-gray-100 p-4">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class LayoutComponent { }
