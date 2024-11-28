export interface Viaje {
    id?: number;
    origen: string;
    destino: string;
    fechaSalida: string;
    fechaLlegada: string;
    precio: number;
    capacidadTotal: number;
    asientosDisponibles: number;
}