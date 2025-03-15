// modal-asignar.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProyectoService } from '../../services/proyecto.service';
import { TareaService } from '../../services/tarea.service';
import { Proyecto } from '../../model/proyecto';
import { Usuario } from '../../model/usuario';
import { Tarea } from '../../model/tarea';

@Component({
  selector: 'app-modal-asignar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-asignar.component.html',
  styleUrl: './modal-asignar.component.css'
})
export class ModalAsignarComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  @Output() usuarioSeleccionado = new EventEmitter<string>(); 
  @Output() asignarCorreo = new EventEmitter<string>();
  @Input() proyecto!: Proyecto;
  @Input() tarea!: Tarea;
  @Input() errorMessage: string = '';
  seleccionado: Usuario | null = null;
  invitados: Usuario[] = [];

  constructor(
    private proyectoService: ProyectoService,
    private tareaService: TareaService
  ) { }

  ngOnInit() {
    this.cargarInvitados();
  }

  cargarInvitados() {
    if (this.proyecto && this.proyecto.invitados) {
      this.invitados = this.proyecto.invitados;
      console.log('Invitados cargados:', this.invitados);
    }
  }

  cerrarModal(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.cerrar.emit();
  }

  seleccionarCorreo(usuario: Usuario) {
    this.seleccionado = usuario;
    this.usuarioSeleccionado.emit(usuario.email);
  }

  asignar() {
    if (this.seleccionado) {
      this.asignarCorreo.emit(this.seleccionado.email);
    }
  }
}
