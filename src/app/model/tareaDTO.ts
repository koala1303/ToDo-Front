import { Usuario } from "./usuario";

export class TareaDTO {
  descripcion: string;
  fechaVencimiento?: string;
  prioridad: string;
  proyectoId: number;
  activo: boolean;
  asignado?: string | null;
  usuarioAsignado?: Usuario | null;

  constructor(
    descripcion: string,
    fechaVencimiento: string,
    prioridad: string,
    proyectoId: number,
    activo: boolean,
    asignado?: string | null,
    usuarioAsignado?: Usuario | null
  ) {
    this.descripcion = descripcion;
    this.fechaVencimiento = fechaVencimiento;
    this.prioridad = prioridad;
    this.proyectoId = proyectoId;
    this.activo = activo;
    this.asignado = asignado ?? null;
    this.usuarioAsignado = usuarioAsignado ?? null;
  }
}