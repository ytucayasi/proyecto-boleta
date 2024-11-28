// pasaje-compra.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasajeService } from '../../../../core/services/pasaje.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ViajeService } from '../../../../core/services/viaje.service';
import { Viaje } from '../../../../core/interfaces/viaje.interface';

@Component({
  selector: 'app-pasaje-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pasaje-compra.component.html'
})
export class PasajeCompraComponent implements OnInit {
  asientoSeleccionado: number = 0;
  usuarioId: number = 0;
  loading: boolean = false;
  error: string = '';
  success: boolean = false;
  viaje?: Viaje;
  asientosDisponiblesArray: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pasajeService: PasajeService,
    private authService: AuthService,
    private viajeService: ViajeService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
      return;
    }

    // Obtener origen y destino de los query params
    const origen = this.route.snapshot.queryParamMap.get('origen');
    const destino = this.route.snapshot.queryParamMap.get('destino');

    if (!origen || !destino) {
      this.error = 'Información de ruta incompleta';
      setTimeout(() => this.router.navigate(['/viajes']), 2000);
      return;
    }

    this.cargarInformacionViaje(origen, destino);
  }

  cargarInformacionViaje(origen: string, destino: string): void {
    this.loading = true;
    this.viajeService.buscarViajesPorRuta(origen, destino).subscribe({
      next: (viajes) => {
        if (viajes.length > 0) {
          this.viaje = viajes[0]; // Tomamos el primer viaje disponible
          // Creamos el array de asientos basado en la capacidad total
          this.asientosDisponiblesArray = Array.from(
            { length: this.viaje.capacidadTotal },
            (_, i) => i + 1
          );
          this.loading = false;
        } else {
          this.error = 'No se encontraron viajes disponibles para esta ruta';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/viajes']), 2000);
        }
      },
      error: (err) => {
        this.error = 'Error al cargar la información del viaje';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/viajes']), 2000);
      }
    });
  }

  esAsientoDisponible(numeroAsiento: number): boolean {
    if (!this.viaje) return false;
    return numeroAsiento <= this.viaje.capacidadTotal &&
      this.viaje.asientosDisponibles > 0;
  }

  comprar(): void {
    if (!this.asientoSeleccionado || !this.viaje) {
      this.error = 'Por favor seleccione un asiento válido';
      return;
    }

    if (!this.usuarioId) {
      this.error = 'Por favor ingrese el ID del usuario';
      return;
    }

    if (!this.esAsientoDisponible(this.asientoSeleccionado)) {
      this.error = 'El asiento seleccionado no está disponible';
      return;
    }

    if (this.asientoSeleccionado > this.viaje.capacidadTotal) {
      this.error = `El número de asiento debe ser menor o igual a ${this.viaje.capacidadTotal}`;
      return;
    }

    this.loading = true;
    this.error = '';

    this.pasajeService.comprarPasaje(
      this.viaje.id,
      this.asientoSeleccionado,
      this.usuarioId // Ahora usamos el ID ingresado manualmente
    ).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/pasajes']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al procesar la compra';
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/viajes']);
  }
}