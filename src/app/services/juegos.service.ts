import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Juego } from '../models/juegos.models'; // Asegúrate que este modelo exista

@Injectable({
  providedIn: 'root',
})
export class JuegosService {
  private apiUrl = 'https://apigame.gonzaloandreslucio.com/api/juegos';

  constructor(private http: HttpClient) {}

  // Cabeceras HTTP para las peticiones
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // Obtener todos los juegos
  getAllJuegos(): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  // Obtener un juego por ID
  getJuegoById(id: number): Observable<Juego> {
    return this.http.get<Juego>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Crear un nuevo juego (sin enviar el campo 'id')
  createJuego(juego: Omit<Juego, 'id'>): Observable<Juego> {
    return this.http.post<Juego>(this.apiUrl, juego, {
      headers: this.getHeaders(),
    });
  }
}
