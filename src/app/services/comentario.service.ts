import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComentarioDTO } from '../model/comentarioDTO';
import { Comentario } from '../model/comentario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  private baseUrl = 'http://localhost:8080/api/comentarios';

  constructor(private http: HttpClient) { }

  listarComentarios(id_tarea: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.baseUrl}/${id_tarea}`);
  }
  
  crearComentario(id_tarea: number, comentarioDTO: ComentarioDTO): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.baseUrl}/${id_tarea}`, comentarioDTO);
  }
}