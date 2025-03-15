import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Proyecto } from '../../model/proyecto';
import { Tarea } from '../../model/tarea';
import { ActivatedRoute, Router } from '@angular/router';
import { ProyectoService } from '../../services/proyecto.service';
import { TareaService } from '../../services/tarea.service';
import { TareaDTO } from '../../model/tareaDTO';
import { ModalTareaComponent } from '../modal-tarea/modal-tarea.component';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ModalInvitarComponentt } from '../modal-invitar/modal-invitar.component';
import { ModalComentarioComponent } from '../modal-comentario/modal-comentario.component';
import { ModalAsignarComponent } from '../modal-asignar/modal-asignar.component';
import { ComentarioService } from '../../services/comentario.service';
import { ComentarioDTO } from '../../model/comentarioDTO';
import { Comentario } from '../../model/comentario';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-proyecto-detalle',
  standalone: true,
  imports: [CommonModule, ModalTareaComponent, FormsModule,
    ModalInvitarComponentt, ModalComentarioComponent, ModalAsignarComponent],
  templateUrl: './proyecto-detalle.component.html',
  styleUrl: './proyecto-detalle.component.css'
})

export class ProyectoDetalleComponent implements OnInit {
  proyecto: Proyecto | null = null;

  tareas: Tarea[] = [];
  comentarios: any[] = [];
  mostrarModal: boolean = false;
  mostrarModalInvitar: boolean = false;
  mostrarModalComentarios: boolean = false;
  mostrarModalAsignar: boolean = false;
  tareaSeleccionada: Tarea | null = null;
  idTareaSeleccionada: number = 0;

  errorMessage: string = '';
  errorFecha: string = '';
  errorPrioridad: string = '';

  menuEstado: { [key: number]: boolean } = {}; /**estado del menu */
  fechaMinima: string = new Date().toISOString().split('T')[0];

  tareasActivas: Tarea[] = [];
  tareasCompletadas: Tarea[] = [];

  /**campos para edicion */
  editarId: number | null = null;
  editarNombre: string = '';
  editarPrioridad: string = '';
  editarFecha: string = '';
  editarAsignado: string = '';

  constructor(
    private route: ActivatedRoute,
    private proyectoService: ProyectoService,
    private tareaService: TareaService,
    private comentarioService: ComentarioService,
    private router: Router,
  ) { }

  ngOnInit() {
    const proyectoId = this.route.snapshot.paramMap.get('id');
    if (proyectoId) {
      this.cargarDetallesProyecto(Number(proyectoId));
    } else {
      this.router.navigate(['/proyecto']);
    }
  }

  cargarDetallesProyecto(id: number) {
    this.proyectoService.getProyectoById(id).subscribe({
      next: (proyecto: Proyecto) => {
        this.proyecto = proyecto;
        this.cargarTareaDelProyecto(id);
      },
      error: (error) => {
        console.error('Error al cargar proyecto', error);
        this.router.navigate(['/proyecto']);
      }
    });
  }

  cargarTareaDelProyecto(proyectoId: number) {
    this.tareaService.listarTareasPorProyecto(proyectoId).subscribe({
      next: (tareas: Tarea[]) => {
        this.tareas = tareas.map(tarea => ({
          ...tarea,
          fechaVencimiento: this.formatearFecha(tarea.fechaVencimiento),
          // Asegúrate de mapear el campo asignado correctamente
          asignado: tarea.asignado ? new Usuario({
            username: tarea.asignado.username,
            email: tarea.asignado.email,
            dni: tarea.asignado.dni
          }) : null
        }))
        .sort((a, b) => this.ordenarPrioridad(a.prioridad, b.prioridad));
        
        // Separar tareas
        this.separarTareas();
        console.log('Tareas cargadas y ordenadas:', this.tareas);
      },
      error: (error) => {
        console.error('Error al cargar tareas', error);
      }
    });
  }

  /**filtro para tareas completadas */
  separarTareas() {
    this.tareasActivas = this.tareas
      .filter(tarea => tarea.activo)
      .sort((a, b) => this.ordenarPrioridad(a.prioridad, b.prioridad));

    this.tareasCompletadas = this.tareas
      .filter(tarea => !tarea.activo);
  }

  //orden de prioridad
  ordenarPrioridad(a: string, b: string): number {
    const prioridadOrden: Record<'Alta' | 'Media' | 'Baja', number> = {
      Alta: 1,
      Media: 2,
      Baja: 3,
    };

    const prioridadA = prioridadOrden[a as keyof typeof prioridadOrden] || 4;
    const prioridadB = prioridadOrden[b as keyof typeof prioridadOrden] || 4;

    return prioridadA - prioridadB;
  }

  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return '';
    const fechaFormato = new Date(fecha);
    return isNaN(fechaFormato.getTime()) ? '' : fechaFormato.toISOString();
  }

  /**modal tarea*/
  guardar(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarTarea(tareaDTO: TareaDTO): void {
    if (this.proyecto) {
      const formattedFechaVencimiento = tareaDTO.fechaVencimiento
        ? new Date(tareaDTO.fechaVencimiento).toISOString().slice(0, 19)
        : new Date().toISOString().slice(0, 19);

      const tareaCompleta = new TareaDTO(
        tareaDTO.descripcion,
        formattedFechaVencimiento,
        tareaDTO.prioridad,
        this.proyecto.id,
        true,
        tareaDTO.asignado
      );

      this.tareaService.crearTarea(tareaCompleta).subscribe({
        next: (tarea: Tarea) => {
          this.tareas.push(tarea);
          this.tareasActivas.push(tarea);

          this.tareasActivas.sort((a, b) => this.ordenarPrioridad(a.prioridad, b.prioridad));

          this.cerrarModal();
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error detallado:', error);
          this.errorMessage = 'Ya existe una tarea con este nombre';
        }
      });
    }
  }

  /**modal invitar*/
  abrirModalInvitar(): void {
    this.mostrarModalInvitar = true;
  }

  cerrarModalInvitar(): void {
    this.mostrarModalInvitar = false;
  }

  procesarInvitacion(correo: string) {
    console.log(`Invitación enviada a ${correo}`);
  }


  /**menu de opciones puntitos*/
  menuOpciones(tarea: Tarea) {
    Object.keys(this.menuEstado).forEach(key => {
      if (parseInt(key) !== tarea.id) {
        this.menuEstado[parseInt(key)] = false;
      }
    });

    this.menuEstado[tarea.id] = !this.menuEstado[tarea.id];
  }

  /**para click fueras del menu */
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.opciones-container')) {
      this.menuEstado = {};
    }
  }

  editarTarea(tarea: Tarea) {
    this.editarId = tarea.id;
    this.editarNombre = tarea.descripcion;
    this.editarPrioridad = tarea.prioridad;
    this.editarFecha = this.convertirFechaISOaInputDate(tarea.fechaVencimiento);
  }

  convertirFechaISOaInputDate(fecha: string | undefined): string {
    if (!fecha) return '';

    const fechaISO = new Date(fecha);
    const anio = fechaISO.getFullYear();
    const mes = String(fechaISO.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaISO.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  eliminarTarea(tarea: Tarea) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tareaService.eliminarTarea(tarea.id).subscribe({
          next: () => {
            // Eliminar de todas las listas de tareas
            this.tareas = this.tareas.filter(t => t.id !== tarea.id);
            this.tareasActivas = this.tareasActivas.filter(t => t.id !== tarea.id);
            this.tareasCompletadas = this.tareasCompletadas.filter(t => t.id !== tarea.id);

            Swal.fire('Eliminado', 'La tarea ha sido eliminada.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar la tarea', error);
            Swal.fire('Error', 'No se pudo eliminar la tarea.', 'error');
          }
        });
      }
    });
  }

  eliminarTareaC(tarea: Tarea) {
    this.tareaService.eliminarTarea(tarea.id).subscribe({
      next: () => {
        // Eliminar de todas las listas de tareas
        this.tareas = this.tareas.filter(t => t.id !== tarea.id);
        this.tareasActivas = this.tareasActivas.filter(t => t.id !== tarea.id);
        this.tareasCompletadas = this.tareasCompletadas.filter(t => t.id !== tarea.id);
      },
      error: (error) => {
        console.error('Error al eliminar la tarea', error);
      }
    });
  }

  cancelarEdicion() {
    this.editarId = null;
    this.editarNombre = '';
    this.editarPrioridad = '';
    this.editarFecha = "";
  }

  validarTarea(): boolean {
    this.errorMessage = '';
    this.errorFecha = '';
    this.errorPrioridad = '';

    if (!this.editarNombre.trim()) {
      this.errorMessage = 'El nombre es obligatorio.';
      return false;
    }

    if (!this.editarFecha) {
      this.errorFecha = 'La fecha de vencimiento es obligatoria.';
      return false;
    }

    const fechaSeleccionada = new Date(this.editarFecha);
    const fechaHoy = new Date();
    fechaHoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < fechaHoy) {
      this.errorFecha = 'La fecha de vencimiento no puede ser un día anterior al actual.';
      return false;
    }

    if (!this.editarPrioridad) {
      this.errorPrioridad = 'La prioridad es obligatoria.';
      return false;
    }

    return true;
  }

  guardarEdicion(tarea: Tarea) {
    if (!this.validarTarea()) {
      console.error('Validación fallida, la tarea no se actualizará');
      return;
    }
    const formattedFecha = this.editarFecha
      ? new Date(this.editarFecha).toISOString().slice(0, 19)
      : new Date().toISOString().slice(0, 19);

    const tareaDTO = new TareaDTO(
      this.editarNombre,
      formattedFecha,
      this.editarPrioridad,
      this.proyecto?.id || 0,
      true
    );

    this.tareaService.actualizarTarea(tarea.id, tareaDTO).subscribe({
      next: (response) => {
        this.tareas = this.tareas.map(t => t.id === tarea.id ? response : t);
        this.separarTareas();
        this.cancelarEdicion();
      },
      error: (error) => {
        console.error('Error al actualizar la tarea', error);
        this.errorMessage = 'Ya existe una tarea con este nombre';
      }
    });
  }

  /**estado de la tarea */
  cambiarEstadoTarea(tarea: Tarea) {
    const tareaDTO = new TareaDTO(
      tarea.descripcion,
      tarea.fechaVencimiento || '',
      tarea.prioridad,
      tarea.proyectoId,
      !tarea.activo,
      tarea.asignado?.email,
      tarea.asignado
    );

    this.tareaService.actualizarTarea(tarea.id, tareaDTO).subscribe({
      next: (tareaActualizada) => {
        const index = this.tareas.findIndex(t => t.id === tarea.id);
        if (index !== -1) {
          this.tareas[index] = tareaActualizada;
        }
        this.separarTareas();
      },
      error: (error) => {
        console.error('Error al actualizar el estado de la tarea', error);
      }
    });
  }

  /**sonido */
  sonidito(): void {
    const audio = new Audio('./assets/sounds/minecraft-click-cropped.mp3');
    audio.play();
  }

  /*--------- Lógica para Asignaciones ---------*/
  
   abrirModalAsignar(tarea: Tarea) {
    this.tareaSeleccionada = tarea;
    this.mostrarModalAsignar = true;
  }

  cerrarModalAsignar(): void {
    this.mostrarModalAsignar = false;
    this.tareaSeleccionada = null;
  }

  procesarAsignacion() {
    console.log();
  }

  asignarCorreoTarea(correo: string) {
    if (!this.tareaSeleccionada) {
      console.error('No hay tarea seleccionada para asignar el correo');
      return;
    }
  
    // Encuentra el usuario correspondiente al correo
    const usuarioAsignado = this.proyecto?.invitados?.find(usuario => usuario.email === correo);
  
    const tareaDTO = new TareaDTO(
      this.tareaSeleccionada.descripcion,
      this.tareaSeleccionada.fechaVencimiento || '', 
      this.tareaSeleccionada.prioridad,
      this.tareaSeleccionada.proyectoId,
      this.tareaSeleccionada.activo,
      correo,
      usuarioAsignado // Pasa el usuario completo
    );
  
    this.tareaService.actualizarTarea(this.tareaSeleccionada.id, tareaDTO).subscribe({
      next: (response) => {
        this.tareas = this.tareas.map(t => t.id === this.tareaSeleccionada!.id ? {
          ...response,
          asignado: usuarioAsignado, // Usa el campo asignado
          fechaVencimiento: this.formatearFecha(response.fechaVencimiento)
        } : t);
        this.separarTareas();
        this.mostrarModalAsignar = false;
      },
      error: (error) => {
        console.error('Error al asignar correo a la tarea', error);
      }
    });
  }


  /*--------- Lógica para Comentarios ---------*/

   abrirModalComentarios(tarea: Tarea) {
    this.idTareaSeleccionada = tarea.id;
    this.tareaSeleccionada = tarea;
    this.mostrarModalComentarios = true;
    this.listarComentarios(tarea);
  }
  
  cerrarModalComentarios() {
    this.mostrarModalComentarios = false;
    this.tareaSeleccionada = null;
    this.comentarios = [];
  }
    
  listarComentarios(tarea: Tarea | null) {
    if (tarea && tarea.id) {
      this.comentarioService.listarComentarios(tarea.id).subscribe({
        next: (comentarios) => {
          this.comentarios = comentarios.map(comentario => ({
            ...comentario,
            emailUsuario: comentario.usuario?.email || ''
          }));
          console.log(this.comentarios);
        },
        error: (error) => {
          console.error('Error al cargar comentarios', error);
        }
      });
    }
  }
  
  guardarComentario(comentario: string) {
    if (this.tareaSeleccionada && comentario.trim()) {
      const comentarioDTO: ComentarioDTO = { contenido: comentario };
  
      this.comentarioService.crearComentario(this.tareaSeleccionada.id, comentarioDTO).subscribe({
        next: (nuevoComentario) => {
          this.comentarios.push(nuevoComentario);
          this.listarComentarios(this.tareaSeleccionada);
        },
        error: (error) => {
          console.error('Error al guardar el comentario:', error);
          Swal.fire('Error', 'No se pudo guardar el comentario.', 'error');
        }
      });
    } else {
      Swal.fire('Advertencia', 'El comentario no puede estar vacío.', 'warning');
    }
  }
}