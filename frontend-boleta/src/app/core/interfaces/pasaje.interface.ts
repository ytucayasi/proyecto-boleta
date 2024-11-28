import { User }  from './user.interface';
import { Viaje }  from './viaje.interface';

export interface Pasaje {
    id: number;
    usuario: User;
    viaje: Viaje;
    numeroAsiento: number;
    fechaCompra: string;
    estado: string;
    codigoReserva: string;
  }