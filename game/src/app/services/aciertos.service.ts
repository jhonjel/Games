import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Aciertos } from '../models/aciertos.model'; // Asegúrate de que este modelo esté actualizado

@Injectable({
  providedIn: 'root'
})
export class AciertosService {
  private apiUrl = 'https://apigame.gonzaloandreslucio.com/api/aciertos';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  getAciertos(): Observable<Aciertos[]> {
    return this.http.get<Aciertos[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getAciertoById(id: number): Observable<Aciertos> {
    return this.http.get<Aciertos>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Crea un nuevo registro de acierto, asegurando que 'tiempo' y 'user_id' sean números.
   * @param acierto Objeto Aciertos (sin 'id') del frontend.
   * @returns Observable con la respuesta del backend.
   */
  createAcierto(acierto: Omit<Aciertos, 'id'>): Observable<Aciertos> {
    const backendPayload = {
      partida_id: acierto.partida_id,
      user_id: acierto.user_id,   // Ahora se espera que 'acierto.user_id' sea un número
      aciertos: acierto.aciertos,
      tiempo: acierto.tiempo,     // Ahora se espera que 'acierto.tiempo' sea un número
    };

    console.log('Payload de Aciertos enviado:', backendPayload);

    return this.http.post<Aciertos>(this.apiUrl, backendPayload, {
      headers: this.getHeaders(),
    });
  }
}
