export class ProyectoDTO {
  nombre: string;
  descripcion?: string;
  invitados: string[];
  
  constructor(nombre: string, descripcion?: string, invitados: string[] = []) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.invitados = invitados;
  }
}