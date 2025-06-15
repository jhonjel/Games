import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Tus modelos reales (asegúrate de que las rutas y el contenido sean correctos)
import { Card } from '../../models/card.model'; // Tu Card Model existente
import { Partida } from '../../models/partida.model';
import { Usuario } from '../../models/usuario.model';

// Tus servicios reales (asegúrate de que las rutas sean correctas)
import { AciertosService } from '../../services/aciertos.service';
import { JuegosService } from '../../services/juegos.service';
import { PartidaService } from '../../services/partida.service';

// Tu CardComponent existente (asegúrate de que la ruta sea correcta)
import { CardComponent } from '../card/card.component';

// Interfaz para el payload de Aciertos (si no tienes un archivo de modelo separado para esto)
// He cambiado partida_id a string para consistencia con res.id
interface AciertoPayload {
  partida_id: number; // Cambiado a string para coincidir con res.id de Partida
  user_id: number;
  aciertos: number;
  tiempo: number;
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CardComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.sass'],
})
export class BoardComponent implements OnInit, OnDestroy {
  cards: Card[] = [];
  // Símbolos que usas para tus cartas (emojis) - se mapearán a 'value'
  symbols: string[] = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
  flippedCards: Card[] = [];
  lockBoard: boolean = false;

  currentPlayer: number = 1;

  jugador1: Usuario = { id: '', name: '', email: '', password: '', password_confirmation: '', juego_id: '' };
  jugador2: Usuario = { id: '', name: '', email: '', password: '', password_confirmation: '', juego_id: '' };

  gameStats = {
    player1: { moves: 0, pairs: 0, time: 0 },
    player2: { moves: 0, pairs: 0, time: 0 }
  };

  timerInterval: any;
  totalGameTime: number = 0;
  showWinMessageFlag: boolean = false;
  winner: number | null = null;
  winnerText: string = '';

  juegoListObject?: any = [];

  // Variable para manejar el mensaje de error en la carga de jugadores
  errorMessage: string = '';

  private readonly ID_JUEGO_FIJO: string = "de5b558c-964c-4929-ab1e-343500c792d4";

  constructor(
    private juegosService: JuegosService,
    private partidaService: PartidaService,
    private aciertosService: AciertosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Aquí puedes cargar datos de juegos si es necesario
    this.juegosService.getAllJuegos().subscribe(data => this.juegoListObject = data);

    const jugador1Data = localStorage.getItem('jugador1');
    const jugador2Data = localStorage.getItem('jugador2');

    if (jugador1Data && jugador2Data) {
      const parsedJugador1 = JSON.parse(jugador1Data);
      const parsedJugador2 = JSON.parse(jugador2Data);

      this.jugador1 = {
        id: parsedJugador1.id || '',
        name: parsedJugador1.name || parsedJugador1.username || '',
        email: parsedJugador1.email || '',
        password: parsedJugador1.password || '',
        password_confirmation: parsedJugador1.password_confirmation || parsedJugador1.password_confirm || '',
        juego_id: parsedJugador1.juego_id || parsedJugador1.idjuego || this.ID_JUEGO_FIJO
      };

      this.jugador2 = {
        id: parsedJugador2.id || '',
        name: parsedJugador2.name || parsedJugador2.username || '',
        email: parsedJugador2.email || '',
        password: parsedJugador2.password || '',
        password_confirmation: parsedJugador2.password_confirmation || parsedJugador2.password_confirm || '',
        juego_id: parsedJugador2.juego_id || parsedJugador2.idjuego || this.ID_JUEGO_FIJO
      };
      console.log('Jugadores de localStorage cargados y adaptados en BoardComponent:', this.jugador1, this.jugador2);
      this.resetGame(); // Reinicia el juego solo si los jugadores se cargaron exitosamente
    } else {
      console.error('Jugadores no encontrados en localStorage. Redirige al registro si es necesario.');
      // Establece el mensaje de error para mostrar en la plantilla
      this.errorMessage = 'No se pudieron cargar los jugadores. Por favor, asegúrate de haberlos seleccionado en la página de inicio.';
      // No llamar a resetGame si los jugadores no se encuentran, para evitar errores
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  resetGame(): void {
    this.showWinMessageFlag = false;
    this.winner = null;
    this.winnerText = '';
    this.currentPlayer = 1;
    this.totalGameTime = 0;

    this.gameStats.player1 = { moves: 0, pairs: 0, time: 0 };
    this.gameStats.player2 = { moves: 0, pairs: 0, time: 0 };

    this.flippedCards = [];
    this.lockBoard = false;

    // Adaptado para usar 'value' y 'revealed' como tu CardComponent espera
    this.cards = this.shuffleCards(this.symbols.concat(this.symbols)).map((value, index) => ({
      id: index,
      value,
      revealed: false,
      matched: false,
      matchedBy: null
    }));

    clearInterval(this.timerInterval);
    this.startTimer();
  }

  shuffleCards(array: string[]): string[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Se adapta para recibir solo el evento de click (void)
  // y luego encuentra la carta correcta en el array 'cards'
  onCardClick(clickedCard: Card): void {
    // Si el tablero está bloqueado, la carta ya está revelada o emparejada, o el juego terminó, ignora el clic
    if (this.lockBoard || clickedCard.revealed || clickedCard.matched || this.showWinMessageFlag) {
      return;
    }

    // Encuentra la carta en el array principal para asegurar la referencia correcta
    const cardInBoard = this.cards.find(c => c.id === clickedCard.id);
    if (!cardInBoard) return;

    cardInBoard.revealed = true; // Voltea la carta (usa 'revealed')
    this.flippedCards.push(cardInBoard);

    if (this.flippedCards.length === 2) {
      this.processMove();
    }
  }

  processMove(): void {
    const [first, second] = this.flippedCards;
    const playerKey = `player${this.currentPlayer}` as 'player1' | 'player2';

    this.gameStats[playerKey].moves++;

    // Usa 'value' para comparar las cartas
    if (first.value === second.value) {
      first.matched = true;
      second.matched = true;
      first.matchedBy = this.currentPlayer;
      second.matchedBy = this.currentPlayer;

      this.gameStats[playerKey].pairs++;

      this.flippedCards = [];

      if (this.checkWin()) {
        this.endGame();
      }
    } else {
      this.lockBoard = true;
      setTimeout(() => {
        first.revealed = false;
        second.revealed = false;
        this.flippedCards = [];
        this.lockBoard = false;
        this.switchPlayer();
      }, 1200);
    }
  }

  switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }

  checkWin(): boolean {
    return this.cards.every(card => card.matched);
  }

  endGame(): void {
    this.showWinMessageFlag = true;
    clearInterval(this.timerInterval);

    let ganador = 0;
    if (this.gameStats.player1.pairs > this.gameStats.player2.pairs) {
      this.winner = ganador = 1;
      this.winnerText = `¡${this.jugador1.name} gana! 🎉`;
    } else if (this.gameStats.player2.pairs > this.gameStats.player1.pairs) {
      this.winner = ganador = 2;
      this.winnerText = `¡${this.jugador2.name} gana! 🎉`;
    } else {
      this.winner = 0;
      this.winnerText = '¡Empate!';
    }

    const today = new Date();
    const formattedDate = today.getFullYear() + '-' +
                          String(today.getMonth() + 1).padStart(2, '0') + '-' +
                          String(today.getDate()).padStart(2, '0');

    const partidaPayload: Omit<Partida, 'id'> = {
      juego_id: this.ID_JUEGO_FIJO,
      fecha: formattedDate,
      tiempo: this.totalGameTime,
      nivel: 'Facil'
    };

    console.log('Objeto partida a enviar (payload):', partidaPayload);

    this.partidaService.createPartida(partidaPayload).subscribe({
      next: (res: any) => {
        console.log('✅ Partida guardada:', res);
        const partidaId = res.id;

        const aciertosJugador1Payload: AciertoPayload = {
          partida_id: partidaId, // Ahora es string
          user_id: Number(this.jugador1.id),
          aciertos: this.gameStats.player1.pairs,
          tiempo: this.gameStats.player1.time
        };

        const aciertosJugador2Payload: AciertoPayload = {
          partida_id: partidaId, // Ahora es string
          user_id: Number(this.jugador2.id),
          aciertos: this.gameStats.player2.pairs,
          tiempo: this.gameStats.player2.time
        };

        console.log('Objeto aciertos Jugador 1 a enviar (payload):', aciertosJugador1Payload);
        console.log('Objeto aciertos Jugador 2 a enviar (payload):', aciertosJugador2Payload);

        this.aciertosService.createAcierto(aciertosJugador1Payload).subscribe({
          next: () => console.log('✅ Aciertos jugador 1 guardados'),
          error: err => console.error('❌ Error guardar aciertos jugador 1', err)
        });

        this.aciertosService.createAcierto(aciertosJugador2Payload).subscribe({
          next: () => console.log('✅ Aciertos jugador 2 guardados'),
          error: err => console.error('❌ Error guardar aciertos jugador 2', err)
        });
      },
      error: (err) => {
        console.error('❌ Error al guardar partida:', err);
        if (err.error && err.error.message) {
          console.error('Mensaje del servidor (partida):', err.error.message);
        }
        if (err.error && err.error.errors) {
          console.error('Detalles de errores de validación (partida):', err.error.errors);
        }
      }
    });
  }

  startTimer(): void {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.showWinMessageFlag) {
        clearInterval(this.timerInterval);
        return;
      }
      const playerKey = `player${this.currentPlayer}` as 'player1' | 'player2';
      this.gameStats[playerKey].time++;
      this.totalGameTime++;
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  }

  volverInicio(): void {
    this.router.navigate(['/']);
  }
}
