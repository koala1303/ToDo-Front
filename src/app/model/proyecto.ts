import { Tarea } from './tarea';
import { Usuario } from './usuario';

export class Proyecto {
  id: number;
  nombre: string;
  descripcion?: string;
  usuarioId: number;
  tareas: Tarea[];
  invitados?: Usuario[]; 

  constructor(
    id: number,
    nombre: string,
    usuarioId: number,
    descripcion?: string,
    tareas: Tarea[] = [],
    invitados: Usuario[] = []
  ) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.usuarioId = usuarioId;
    this.tareas = tareas;
    this.invitados = invitados;
  }
}
