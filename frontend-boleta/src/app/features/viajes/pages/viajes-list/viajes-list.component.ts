// src/app/features/viajes/pages/viajes-list/viajes-list.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViajeService } from '../../../../core/services/viaje.service';
import { Viaje } from '../../../../core/interfaces/viaje.interface';

@Component({
  selector: 'app-viajes-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Listado de Viajes</h1>
        <a routerLink="/viajes/nuevo" 
           class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Nuevo Viaje
        </a>
      </div>

      <!-- Loading State -->
      @if (loading) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      }

      <!-- Error State -->
      @if (error) {
        <div class="bg-red-50 p-4 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error al cargar los viajes</h3>
              <p class="text-sm text-red-700 mt-2">Por favor, intente nuevamente más tarde.</p>
            </div>
          </div>
        </div>
      }

      <!-- No Data State -->
      @if (!loading && !error && (!viajes || viajes.length === 0)) {
        <div class="text-center py-12 bg-gray-50 rounded-lg">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay viajes disponibles</h3>
          <p class="mt-1 text-sm text-gray-500">Comience creando un nuevo viaje.</p>
        </div>
      }

      <!-- Data Table -->
      @if (!loading && !error && viajes && viajes.length > 0) {
        <div class="overflow-x-auto bg-white shadow rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Origen
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destino
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Salida
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Llegada
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asientos
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (viaje of viajes; track viaje.id) {
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{viaje.origen}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{viaje.destino}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{viaje.fechaSalida | date:'dd/MM/yyyy HH:mm'}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{viaje.fechaLlegada | date:'dd/MM/yyyy HH:mm'}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    S/ {{viaje.precio}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{viaje.asientosDisponibles}}/{{viaje.capacidadTotal}}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class ViajesListComponent implements OnInit {
  viajes: Viaje[] = [];
  loading = true;
  error = false;

  constructor(private viajeService: ViajeService) { }

  ngOnInit() {
    this.cargarViajes();
  }

  cargarViajes() {
    this.loading = true;
    this.error = false;

    this.viajeService.getViajesDisponibles().subscribe({
      next: (data) => {
        this.viajes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar viajes:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  eliminarViaje(id: number) {
    if (confirm('¿Está seguro de eliminar este viaje?')) {
      this.viajeService.eliminarViaje(id).subscribe({
        next: () => {
          this.viajes = this.viajes.filter(viaje => viaje.id !== id);
        },
        error: (error) => {
          console.error('Error al eliminar viaje:', error);
          alert('Error al eliminar el viaje. Por favor, intente nuevamente.');
        }
      });
    }
  }
}