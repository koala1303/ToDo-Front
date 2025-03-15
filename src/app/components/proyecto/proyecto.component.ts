import { Component, OnInit } from '@angular/core';
import { ModalProyectoComponent } from '../modal-proyecto/modal-proyecto.component';
import { CommonModule } from '@angular/common';
import { Proyecto } from '../../model/proyecto';
import { ProyectoService } from '../../services/proyecto.service';
import { ProyectoDTO } from '../../model/proyectoDTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proyecto',
  standalone: true,
  imports: [ModalProyectoComponent, CommonModule],
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectoComponent implements OnInit {

  proyectos: Proyecto[] = [];
  mostrarModal: boolean = false;
  errorMessage: string = '';

  constructor(private proyectoService: ProyectoService, private router: Router) { }

  ngOnInit() {
    this.obtenerProyectos();
  }

  obtenerProyectos(): void {
    this.proyectoService.getProyectos().subscribe(
      (proyectos: Proyecto[]) => {
        this.proyectos = proyectos;
      },
      (error) => {
        console.error('Error al obtener proyectos:', error);
      }
    );
  }

  /**modal */
  guardar(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarProyecto(proyectoDTO: ProyectoDTO): void {
    this.proyectoService.newProyecto(proyectoDTO).subscribe(
      (proyecto: Proyecto) => {
        this.proyectos.push(proyecto);
        this.cerrarModal();
        this.errorMessage = '';
      },
      (error) => {
        console.error('Error al guardar el proyecto:', error);
        this.errorMessage = 'Ya existe un proyecto con este nombre';
      }
    );
  }

  /**detalle */
  verDetalleProyecto(proyecto: Proyecto) {
    this.router.navigate(['/proyecto-detalle', proyecto.id]);
  }
}
