import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tarea } from '../../model/tarea';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Comentario } from '../../model/comentario';
import { ComentarioService } from '../../services/comentario.service';

@Component({
  selector: 'app-modal-comentario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-comentario.component.html',
  styleUrl: './modal-comentario.component.css'
})
export class ModalComentarioComponent implements OnInit {
  @Input() idTarea: number = 0;
  @Input() comentarios: Comentario[] = []; 
  @Input() tarea: Tarea | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardarComentario = new EventEmitter<string>();

  nuevoComentario: string = '';
  errorMessage: string = '';
  tareaActual: any = null;

  constructor(private comentarioService: ComentarioService) {}

  ngOnInit(): void {
    this.cargarComentarios();
  }

  cargarComentarios() {
    this.comentarioService.listarComentarios(this.idTarea).subscribe({
      next: (data) => {
        this.comentarios = data;
      },
      error: (error) => {
        console.error('Error al cargar los comentarios', error);
        this.errorMessage = 'No se pudieron cargar los comentarios';
      }
    });
  }

  guardarComentarioNuevo() {
    if (this.nuevoComentario.trim()) {
      this.guardarComentario.emit(this.nuevoComentario);
      this.nuevoComentario = '';
    }
  }  
}