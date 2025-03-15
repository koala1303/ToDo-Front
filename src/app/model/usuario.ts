export class Usuario {
    username: string;
    email: string;
    password: string;
    dni: string;

    constructor(data?: Partial<Usuario>) {
        this.username = data?.username || "";
        this.email = data?.email || "";
        this.password = data?.password || "";
        this.dni = data?.dni || "";
    }
}