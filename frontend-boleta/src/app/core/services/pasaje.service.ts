import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PasajeService {
    private baseUrl = 'http://localhost:8080/api/pasajes';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    comprarPasaje(viajeId: number | undefined, numeroAsiento: number, usuarioId: number): Observable<any> {
        const url = `${this.baseUrl}/comprar?viajeId=${viajeId}&numeroAsiento=${numeroAsiento}&usuarioId=${usuarioId}`;
        return this.http.post(url, null, {
            headers: this.authService.getAuthorizationHeaders()
        });
    }

    buscarPasajePorDni(dni: string): Observable<any> {
        const url = `${this.baseUrl}/buscar/dni/${dni}`;
        return this.http.get(url, {
            headers: this.authService.getAuthorizationHeaders()
        });
    }
}