import { Injectable } from '@angular/core';
import { Partida } from '../models/partida.model';

@Injectable({
  providedIn: 'root'
})
export class PartidaService {
  private storageKey = 'partidas';
  private partidaActivaKey = 'partidaActiva';

  // Obtener todas las partidas guardadas
  getPartidas(): Partida[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  // Guardar nueva partida al historial
guardarPartida(partida: Partida): void {
  const partidas = this.getPartidas();

  // Usar `juego_id` como identificador único si no hay `id`
  const index = partidas.findIndex(p => p.juego_id === partida.juego_id);

  if (index !== -1) {
    partidas[index] = partida; // Actualiza
  } else {
    partidas.push(partida); // Agrega
  }

  localStorage.setItem(this.storageKey, JSON.stringify(partidas));
  this.establecerPartidaActiva(partida);
}

  // Establecer partida activa actual
  establecerPartidaActiva(partida: Partida): void {
    localStorage.setItem(this.partidaActivaKey, JSON.stringify(partida));
  }
// Obtener la partida activa
  obtenerPartidaActiva(): Partida | undefined {
  return JSON.parse(localStorage.getItem('partidaActiva') || 'null') || undefined;
  }
}






