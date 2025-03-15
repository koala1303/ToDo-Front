import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TareaDTO } from '../../model/tareaDTO';

@Component({
  selector: 'app-modal-tarea',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-tarea.component.html',
  styleUrls: ['./modal-tarea.component.css']
})
export class ModalTareaComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardarTarea = new EventEmitter<TareaDTO>();
  @Input() errorMessage: string = '';
  errorFecha: string = '';
  errorPrioridad: string = '';

  tareaDTO: TareaDTO = new TareaDTO('', '', '', 0, true);
  
  prioridades: string[] = ['Baja', 'Media', 'Alta'];

  fechaMinima: string = new Date().toISOString().split('T')[0];

  ngOnInit() {
    this.tareaDTO.prioridad = this.prioridades[0];
  }

  cerrarModal(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.cerrar.emit();
  }

  guardar() {
    if (this.validarTarea()) {
      this.guardarTarea.emit(this.tareaDTO);
      this.errorMessage = '';
    }
  }

  validarTarea(): boolean {

    this.errorMessage = '';
    this.errorFecha = '';
    this.errorPrioridad = '';

    if (!this.tareaDTO.descripcion.trim()) {
      this.errorMessage = 'El nombre es obligatorio.';
      return false;
    }
    if (!this.tareaDTO.fechaVencimiento) {
      this.errorFecha = 'La fecha de vencimiento es obligatoria.';
      return false;
    }

    const fechaSeleccionada = new Date(this.tareaDTO.fechaVencimiento);
    const fechaHoy = new Date();
    fechaHoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < fechaHoy) {
      this.errorFecha = 'La fecha de vencimiento no puede ser un día anterior al actual.';
      return false;
    }

    if (!this.tareaDTO.prioridad) {
      this.errorPrioridad = 'La prioridad es obligatoria.';
      
      return false;
    }
    return true;
  }

  limpiarFormulario() {
    this.tareaDTO = new TareaDTO('', '', '', 0, true);
  }
}
