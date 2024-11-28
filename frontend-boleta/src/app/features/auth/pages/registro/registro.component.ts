import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear nueva cuenta
          </h2>
        </div>
        
        <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm space-y-3">
            <!-- Username -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">Usuario</label>
              <input id="username" 
                     formControlName="username" 
                     type="text" 
                     class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     placeholder="Nombre de usuario">
              @if (registerForm.get('username')?.touched && registerForm.get('username')?.errors) {
                <p class="mt-1 text-xs text-red-500">Campo requerido</p>
              }
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
              <input id="password" 
                     formControlName="password" 
                     type="password" 
                     class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     placeholder="Contraseña">
              @if (registerForm.get('password')?.touched && registerForm.get('password')?.errors) {
                <p class="mt-1 text-xs text-red-500">La contraseña es requerida</p>
              }
            </div>

            <!-- Nombre -->
            <div>
              <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
              <input id="nombre" 
                     formControlName="nombre" 
                     type="text" 
                     class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     placeholder="Tu nombre">
            </div>

            <!-- Apellido -->
            <div>
              <label for="apellido" class="block text-sm font-medium text-gray-700">Apellido</label>
              <input id="apellido" 
                     formControlName="apellido" 
                     type="text" 
                     class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     placeholder="Tu apellido">
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input id="email" 
                     formControlName="email" 
                     type="email" 
                     class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     placeholder="tu@ejemplo.com">
              @if (registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['email']) {
                <p class="mt-1 text-xs text-red-500">Email inválido</p>
              }
            </div>

            <!-- DNI -->
            <div>
              <label for="dni" class="block text-sm font-medium text-gray-700">DNI</label>
              <input id="dni" 
                     formControlName="dni" 
                     type="text" 
                     class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     placeholder="12345678">
            </div>

            <!-- Teléfono -->
            <div>
              <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono</label>
              <input id="telefono" 
                     formControlName="telefono" 
                     type="text" 
                     class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     placeholder="987654321">
            </div>
          </div>

          <div>
            <button type="submit" 
                    [disabled]="registerForm.invalid"
                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Registrarse
            </button>
          </div>
        </form>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            ¿Ya tienes una cuenta? 
            <a routerLink="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegistroComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      nombre: [''],
      apellido: [''],
      email: ['', [Validators.email]],
      dni: [''],
      telefono: ['']
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          // Después del registro exitoso, redirigimos al login
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.error('Error en registro:', error);
        }
      });
    }
  }
}
