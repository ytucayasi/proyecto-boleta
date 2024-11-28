export interface User {
    username: string;
    password: string;
    nombre?: string;
    apellido?: string;
    email?: string;
    dni?: string;
    telefono?: string;
    roles?: string[];
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface RegisterResponse {
    message: string;
    user: User;
}