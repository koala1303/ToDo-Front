import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProyectoService } from '../../services/proyecto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-invitar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-invitar.component.html',
  styleUrls: ['./modal-invitar.component.css']
})
export class ModalInvitarComponentt {
  @Input() proyectoId!: number;
  invitar: string = '';

  @Output() cerrar = new EventEmitter<void>();
  @Output() invitacionEnviada = new EventEmitter<string>();
  @Input() errorMessage: string = '';

  constructor(private proyectoService: ProyectoService) { }

  cerrarModal(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.cerrar.emit();
  }

  enviarInvitacion(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.invitar) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '',
      });
      return;
    }

    // Dividir correos con coma
    const correos = this.invitar.split(',').map(correo => correo.trim());
    const correosInvalidos = correos.filter(correo => !emailRegex.test(correo));

    if (correosInvalidos.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Correos inválidos: ${correosInvalidos.join(', ')}`,
      });
      return;
    }

    this.proyectoService.invitarUsuario(this.proyectoId, this.invitar).subscribe({
      next: (respuesta) => {
        Swal.fire({
          icon: 'success',
          title: '¡Invitación enviada!',
          text: `Se ha enviado correctamente la invitación a: ${correos.join(', ')}`,
        });
        this.invitacionEnviada.emit(this.invitar);
        this.cerrarModal();
      },
      error: (error) => {
        const mensajeError = error.error?.message || 'Error al enviar la invitación';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensajeError,
        });
      },
    });
  }
}
