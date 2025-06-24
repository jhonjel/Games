import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
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
  getUsuario(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Crea un nuevo usuario generando un UUID único para su ID.
   * Si tu backend es el responsable de generar el ID,
   * elimina la asignación de 'id' aquí y envía solo 'usuario'.
   */
  crearUsuario(usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    // Genera un UUID único para cada nuevo usuario
    const nuevoUsuarioConId: Usuario = {
      ...usuario,
      id: crypto.randomUUID(), // ¡CORREGIDO! Genera un UUID único
    };

    return this.http.post<Usuario>(this.apiUrl, nuevoUsuarioConId, {
      headers: this.getHeaders(),
    });
  }
}
