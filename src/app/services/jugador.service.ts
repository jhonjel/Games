import { Injectable } from '@angular/core';
import { Jugador } from '../models/jugador.model';

@Injectable({
  providedIn: 'root'
})
export class JugadorService {
  private jugador1: Jugador = { nombre: '', descripcion: '' };
  private jugador2: Jugador = { nombre: '', descripcion: '' };

  setJugadores(j1: Jugador, j2: Jugador) {
    this.jugador1 = j1;
    this.jugador2 = j2;
  }

  getJugador1(): Jugador {
    return this.jugador1;
  }

  getJugador2(): Jugador {
    return this.jugador2;
  }
}
