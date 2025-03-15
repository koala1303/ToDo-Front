export interface Comentario {
  id: number;
  contenido: string;
  fechaCreacion: string;
  usuario: {
    id: number;
    username: string;
    email: string;
  };
  emailUsuario?: string;
}
