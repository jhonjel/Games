import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Partida } from '../models/partida.model';

@Injectable({
  providedIn: 'root'
})
export class PartidaService {
  private apiUrl = 'https://apigame.gonzaloandreslucio.com/api/partidas';

  constructor(private http: HttpClient) {}

  // Cabeceras HTTP para las peticiones
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // Obtener todas las partidas
  getPartidas(): Observable<Partida[]> {
    return this.http.get<Partida[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  // Obtener una partida por ID
  getPartidaById(id: number): Observable<Partida> {
    return this.http.get<Partida>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Crear una nueva partida
  createPartida(partida: Omit<Partida, 'id'>): Observable<Partida> {
    return this.http.post<Partida>(this.apiUrl, partida, {
      headers: this.getHeaders(),
    });
  }
}
