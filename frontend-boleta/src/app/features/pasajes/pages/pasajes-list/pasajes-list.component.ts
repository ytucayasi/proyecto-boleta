import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PasajeService } from '../../../../core/services/pasaje.service';
import { ViajeService } from '../../../../core/services/viaje.service';
import { Pasaje } from '../../../../core/interfaces/pasaje.interface';
import { Viaje } from '../../../../core/interfaces/viaje.interface';
import { debounceTime } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-pasajes-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './pasajes-list.component.html',
})
export class PasajesListComponent implements OnInit {
  pasajes: Pasaje[] = [];
  viajes: Viaje[] = [];
  searchControl = new FormControl('');
  loading = false;
  error: string | null = null;
  searchPerformed = false;

  constructor(
    private pasajeService: PasajeService,
    private viajeService: ViajeService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.setupSearch();
    this.loadViajes();
  }

  loadViajes(): void {
    this.viajeService.getViajesDisponibles().subscribe({
      next: (data) => {
        this.viajes = data;
      },
      error: (err) => {
        this.error = 'Error al cargar viajes disponibles';
      }
    });
  }

  setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
    ).subscribe(value => {
      const searchValue = value?.trim() || '';
      if (searchValue.length >= 8) {
        this.searchByDni(searchValue);
        this.searchPerformed = true;
      } else {
        this.resetSearch();
      }
    });
  }

  searchByDni(dni: string): void {
    this.loading = true;
    this.error = null;

    this.pasajeService.buscarPasajePorDni(dni).subscribe({
      next: (data) => {
        this.pasajes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se encontraron pasajes para el DNI ingresado';
        this.loading = false;
        this.pasajes = [];
      }
    });
  }

  private resetSearch(): void {
    this.pasajes = [];
    this.searchPerformed = false;
    this.error = null;
    this.loading = false;
  }

  comprarPasaje(viaje: Viaje): void {
    if (!viaje.origen || !viaje.destino) return;

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/pasajes/comprar'], {
        queryParams: {
          origen: viaje.origen,
          destino: viaje.destino
        }
      });
    } else {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    }
  }
}