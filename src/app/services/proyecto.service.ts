import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { Proyecto } from '../model/proyecto';
import { ProyectoDTO } from '../model/proyectoDTO';


@Injectable({
  providedIn: 'root'
})

export class ProyectoService {
  private baseUrl = 'http://localhost:8080/api/proyectos';

  constructor(private http: HttpClient) { }

  getProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.baseUrl);
  }

  newProyecto(proyectoDTO: ProyectoDTO): Observable<Proyecto> {
    return this.http.post<Proyecto>(this.baseUrl, proyectoDTO);
  }

  getProyectoById(id: number): Observable<Proyecto> {
    return this.getProyectos().pipe(
      map(proyectos => {
        const proyecto = proyectos.find(p => p.id === id);
        if (!proyecto) {
          throw new Error('Proyecto no encontrado');
        }
        return proyecto;
      })
    );
  }

  //Invitar
  invitarUsuario(proyectoId: number, correos: string): Observable<Proyecto> {
    // Dividir los correos con coma
    const listaCorreos = correos.split(',')
      .map(correo => correo.trim())
      .filter(correo => correo !== '');
  
    return this.getProyectoById(proyectoId).pipe(
      switchMap(proyecto => {
        const proyectoDTO: ProyectoDTO = {
          nombre: proyecto.nombre,
          descripcion: proyecto.descripcion,
          invitados: listaCorreos
        };
  
        return this.http.put<Proyecto>(`${this.baseUrl}/${proyectoId}`, proyectoDTO);
      })
    );
  }

}
