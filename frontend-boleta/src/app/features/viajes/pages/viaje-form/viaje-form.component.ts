// src/app/features/viajes/pages/viaje-form/viaje-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViajeService } from '../../../../core/services/viaje.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Viaje } from '../../../../core/interfaces/viaje.interface';

@Component({
  selector: 'app-viaje-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './viaje-form.component.html'
})
export class ViajeFormComponent implements OnInit {
  viajeForm: FormGroup = this.initForm();
  isEditing = false;
  isSubmitting = false;
  errorMessage = '';
  viajeId?: number;

  constructor(
    private fb: FormBuilder,
    private viajeService: ViajeService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  private initForm(): FormGroup {
    return this.fb.group({
      origen: ['', [Validators.required, Validators.minLength(3)]],
      destino: ['', [Validators.required, Validators.minLength(3)]],
      fechaSalida: ['', [Validators.required]],
      fechaLlegada: ['', [Validators.required]],
      precio: [null, [Validators.required, Validators.min(0)]],
      capacidadTotal: [40, [Validators.required, Validators.min(1)]],
      asientosDisponibles: [{ value: 40, disabled: true }]
    }, { validators: this.validateFechas });
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.authService.isAdmin()) {
      this.router.navigate(['/viajes']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.viajeId = +id;
      this.loadViaje(this.viajeId);
    }
  }

  private validateFechas(group: FormGroup) {
    const fechaSalida = group.get('fechaSalida')?.value;
    const fechaLlegada = group.get('fechaLlegada')?.value;

    if (fechaSalida && fechaLlegada) {
      const fechaSalidaDate = new Date(fechaSalida);
      const fechaLlegadaDate = new Date(fechaLlegada);

      if (fechaSalidaDate >= fechaLlegadaDate) {
        return { fechasInvalidas: true };
      }
    }
    return null;
  }

  private loadViaje(id: number) {
    this.viajeService.getViajePorId(id).subscribe({
      next: (viaje) => {
        this.viajeForm.patchValue({
          ...viaje,
          fechaSalida: this.formatDateForInput(viaje.fechaSalida),
          fechaLlegada: this.formatDateForInput(viaje.fechaLlegada)
        });
      },
      error: (error) => {
        console.error('Error al cargar viaje:', error);
        if (error.status === 401) {
          this.router.navigate(['/auth/login']);
        }
        this.errorMessage = 'Error al cargar el viaje';
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.viajeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const control = this.viajeForm.get(fieldName);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    if (errors['required']) return 'Este campo es requerido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['min']) return `El valor debe ser mayor a ${errors['min'].min}`;
    if (errors['fechasInvalidas']) return 'La fecha de llegada debe ser posterior a la fecha de salida';
    return 'Campo inválido';
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '';
    }
  }

  onSubmit() {
    if (this.viajeForm.invalid || this.isSubmitting) {
      Object.keys(this.viajeForm.controls).forEach(key => {
        const control = this.viajeForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const viajeData: Viaje = {
      ...this.viajeForm.getRawValue(),
      asientosDisponibles: this.viajeForm.get('capacidadTotal')?.value || 40,
      fechaSalida: new Date(this.viajeForm.value.fechaSalida).toISOString(),
      fechaLlegada: new Date(this.viajeForm.value.fechaLlegada).toISOString()
    };

    const request = this.isEditing && this.viajeId
      ? this.viajeService.actualizarViaje(this.viajeId, viajeData)
      : this.viajeService.crearViaje(viajeData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/viajes']);
        console.log("hola");
      },
      error: (error) => {
        console.error('Error al guardar viaje:', error);
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Error al guardar el viaje';

        if (error.status === 401) {
          this.router.navigate(['/auth/login']);
        }
      }
    });
  }
}