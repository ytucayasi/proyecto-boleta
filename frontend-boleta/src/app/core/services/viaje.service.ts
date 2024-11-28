// src/app/core/services/viaje.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { Viaje } from '../interfaces/viaje.interface';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ViajeService {
    private baseUrl = 'http://localhost:8080/api/viajes';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    crearViaje(viaje: Viaje): Observable<Viaje> {
        const headers = this.authService.getAuthorizationHeaders();
        return this.http.post<Viaje>(this.baseUrl, viaje, { headers }).pipe(
            tap(response => {
                console.log('Viaje creado:', response);
            })
        );
    }

    getViajesDisponibles(): Observable<Viaje[]> {
        const headers = this.authService.getAuthorizationHeaders();
        return this.http.get<Viaje[]>(`${this.baseUrl}/disponibles`, { headers }).pipe(
            tap(viajes => {
                console.log('Viajes disponibles:', viajes);
            })
        );
    }

    getViajePorId(id: number): Observable<Viaje> {
        return this.http.get<Viaje>(`${this.baseUrl}/${id}`, {
            headers: this.authService.getAuthorizationHeaders()
        }).pipe(
            catchError(err => {
                console.error('Error in getViajePorId:', err);
                throw err;
            })
        );
    }

    actualizarViaje(id: number, viaje: Viaje): Observable<Viaje> {
        const headers = this.authService.getAuthorizationHeaders();
        return this.http.put<Viaje>(`${this.baseUrl}/${id}`, viaje, { headers }).pipe(
            tap(response => {
                console.log('Viaje actualizado:', response);
            })
        );
    }

    eliminarViaje(id: number): Observable<void> {
        const headers = this.authService.getAuthorizationHeaders();
        return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers }).pipe(
            tap(() => {
                console.log('Viaje eliminado:', id);
            })
        );
    }

    buscarViajesPorRuta(origen: string, destino: string): Observable<Viaje[]> {
        const params = new HttpParams()
            .set('origen', origen)
            .set('destino', destino);

        return this.http.get<Viaje[]>(`${this.baseUrl}/buscar`, {
            params,
            headers: this.authService.getAuthorizationHeaders()
        }).pipe(
            tap(viajes => console.log('Viajes encontrados:', viajes))
        );
    }
}