import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea } from '../model/tarea';
import { TareaDTO } from '../model/tareaDTO';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  private baseUrl = 'http://localhost:8080/api/tareas';

  constructor(private http: HttpClient) { }

  listarTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.baseUrl}/listar`);
  }

  listarTareasPorProyecto(proyectoId: number): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.baseUrl}/proyectos/${proyectoId}`);
  }

  crearTarea(tareaDTO: TareaDTO): Observable<Tarea> {
    return this.http.post<Tarea>(`${this.baseUrl}/crear`, tareaDTO);
  }

  actualizarTarea(id: number, tareaDTO: TareaDTO): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.baseUrl}/actualizar/${id}`, tareaDTO);
  }

  eliminarTarea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`);
  }
}