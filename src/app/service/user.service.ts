import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../usuarios/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://apigame.gonzaloandreslucio.com/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // Obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  // Obtener un usuario por ID
  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Crea un nuevo usuario.
   * El backend debe encargarse de asignar el ID.
   */
  crearUsuario(usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario, {
      headers: this.getHeaders(),
    });
  }
}



