import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  registrarUsuario(usuario:Usuario): Observable<any> {
    return this.http.post<Usuario>(`${this.baseUrl}/api/register`, usuario)
  }
}