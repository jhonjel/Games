import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Card } from '../../models/card.model';
import { CardComponent } from "../card/card.component";
import { Partida } from '../../models/partida.model';
import { PartidaService } from '../../service/partida.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.sass'],
})
export class BoardComponent implements OnInit {
  cards: Card[] = [];
  firstCard: Card | null = null;
  secondCard: Card | null = null;
  lockBoard = false;

  currentPlayer = 1;
  puntajeJugador1 = 0;
  puntajeJugador2 = 0;

  partida?: Partida;
  tiempoTranscurrido: string = '00:00';
  nivel: string = 'Fácil';
  temporizador: any;
  inicioTimestamp = 0;

  constructor(
    private readonly partidaService: PartidaService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPartidaActiva();
    this.generateBoard();
    this.iniciarTemporizador();
  }

  cargarPartidaActiva(): void {
    const partida = this.partidaService.obtenerPartidaActiva();
    if (partida) {
      this.partida = partida;
      this.nivel = partida.nivel || 'Fácil';
    } else {
      console.warn('No se encontró una partida activa.');
    }
  }

  iniciarTemporizador(): void {
    this.inicioTimestamp = Date.now();
    this.temporizador = setInterval(() => {
      const elapsed = Date.now() - this.inicioTimestamp;
      const minutos = Math.floor(elapsed / 60000);
      const segundos = Math.floor((elapsed % 60000) / 1000);
      this.tiempoTranscurrido = `${this.pad(minutos)}:${this.pad(segundos)}`;
    }, 1000);
  }

  pad(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }

  generateBoard(): void {
    const values = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
    const duplicated = [...values, ...values]
      .map((value, i) => ({ id: i, value, revealed: false, matched: false }))
      .sort(() => Math.random() - 0.5);

    this.cards = duplicated;
  }

  onCardClick(card: Card): void {
    if (this.lockBoard || card.revealed || card.matched) return;

    card.revealed = true;

    if (!this.firstCard) {
      this.firstCard = card;
      return;
    }

    this.secondCard = card;
    this.lockBoard = true;

    setTimeout(() => {
      if (this.firstCard!.value === this.secondCard!.value) {
        this.firstCard!.matched = true;
        this.secondCard!.matched = true;

        // Puntaje local
        if (this.currentPlayer === 1) {
          this.puntajeJugador1++;
        } else {
          this.puntajeJugador2++;
        }
      } else {
        this.firstCard!.revealed = false;
        this.secondCard!.revealed = false;
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
      }

      this.firstCard = null;
      this.secondCard = null;
      this.lockBoard = false;
    }, 800);
  }

  finalizarPartida(): void {
    if (!this.partida) return;

    // Detener temporizador
    clearInterval(this.temporizador);

    // Guardar duración de la partida (en segundos)
    const duracionMs = Date.now() - this.inicioTimestamp;
    const segundos = Math.floor(duracionMs / 1000);
    this.partida.tiempo = segundos;

    this.partidaService.guardarPartida(this.partida);

    this.router.navigate(['/']);
  }
}


