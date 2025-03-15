import { Usuario } from "./usuario";

export class Tarea {
  id: number;
  descripcion: string;
  fechaVencimiento?: string;
  prioridad: string;
  proyectoId: number;
  activo: boolean;
  asignado?: Usuario | null;

  constructor(
    id: number,
    descripcion: string,
    prioridad: string,
    proyectoId: number,
    activo: boolean = true,
    fechaVencimiento?: string,
    asignado?: Usuario | null
  ) {
    this.id = id;
    this.descripcion = descripcion;
    this.prioridad = prioridad;
    this.proyectoId = proyectoId;
    this.activo = activo;
    this.fechaVencimiento = fechaVencimiento;
    this.asignado = asignado;
  }
}