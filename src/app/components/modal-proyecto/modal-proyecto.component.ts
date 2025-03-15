import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ProyectoDTO } from '../../model/proyectoDTO';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-proyecto',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-proyecto.component.html',
  styleUrls: ['./modal-proyecto.component.css']
})
export class ModalProyectoComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardarProyecto = new EventEmitter<ProyectoDTO>();
  @Input() errorMessage: string = '';

  proyectoDTO: ProyectoDTO = new ProyectoDTO('', '');

  cerrarModal(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.cerrar.emit();
  }

  guardar() {
    if (!this.proyectoDTO.nombre.trim()) {
      this.errorMessage = 'El nombre del proyecto no puede estar vacío';
    } else {
      this.guardarProyecto.emit(this.proyectoDTO);
    }
  }   
}
