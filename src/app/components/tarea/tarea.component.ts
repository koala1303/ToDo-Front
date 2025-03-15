import { Component } from '@angular/core';
import { TareaService } from '../../services/tarea.service';
import { Tarea } from '../../model/tarea';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarea.component.html',
  styleUrl: './tarea.component.css'
})
export class TareaComponent {
  tareas: Tarea[] = [];

  constructor(private tareaService: TareaService) { }

  ngOnInit() {
    this.cargarTareas();
  }

  cargarTareas() {
    this.tareaService.listarTareas().subscribe({
      next: (datos: Tarea[]) => {
        this.tareas = datos;
      },
      error: (error) => {
        console.error('Error al cargar tareas', error);
      }
    });
  }
}
