import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-iniciar',
  imports: [ HttpClientModule, FormsModule, CommonModule ],
  templateUrl: './iniciar.component.html',
  styleUrl: './iniciar.component.sass'
})
export class IniciarComponent implements OnInit {
   usuarios: Usuario[] = [];

  // Inicialización de jugadores con la nueva estructura de Usuario (name, password_confirmation, juego_id: number)
  jugador1: Usuario = { id: '', name: '', email: '', password: '', password_confirmation: '', juego_id: '' };
  jugador2: Usuario = { id: '', name: '', email: '', password: '', password_confirmation: '', juego_id: '' };

  loadingUsers: boolean = true;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loadingUsers = true;
    this.errorMessage = '';

    this.usuariosService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
        console.log('Usuarios cargados:', this.usuarios);
        this.loadingUsers = false;

        // Opcional: Pre-seleccionar los primeros dos usuarios si existen
        if (this.usuarios.length > 0) {
          // Asegúrate de que los objetos se copien correctamente para evitar referencias
          this.jugador1 = { ...this.usuarios[0] };
          if (this.usuarios.length > 1) {
            this.jugador2 = { ...this.usuarios[1] };
          } else {
            this.jugador2 = { id: '', name: '', email: '', password: '', password_confirmation: '', juego_id: '' };
          }
        }
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
        this.errorMessage = 'No se pudieron cargar los usuarios. Intente de nuevo más tarde.';
        this.loadingUsers = false;
      }
    });

    // Cargar y adaptar datos de localStorage a la nueva estructura si existen
    const jugador1Data = localStorage.getItem('jugador1');
    const jugador2Data = localStorage.getItem('jugador2');

    if (jugador1Data && jugador2Data) {
      const parsedJugador1 = JSON.parse(jugador1Data);
      const parsedJugador2 = JSON.parse(jugador2Data);

      // Mapeo explícito de propiedades antiguas a nuevas (si es necesario por datos persistidos antiguos)
      this.jugador1 = {
        id: parsedJugador1.id || '',
        name: parsedJugador1.name || parsedJugador1.username || '', // Prioriza 'name', si no existe usa 'username'
        email: parsedJugador1.email || '',
        password: parsedJugador1.password || '',
        password_confirmation: parsedJugador1.password_confirmation || parsedJugador1.password_confirm || '', // Prioriza 'password_confirmation'
        juego_id: parsedJugador1.juego_id || (parsedJugador1.idjuego ? parseInt(parsedJugador1.idjuego, 10) : 0) // Convertir 'idjuego' a número
      };

      this.jugador2 = {
        id: parsedJugador2.id || '',
        name: parsedJugador2.name || parsedJugador2.username || '',
        email: parsedJugador2.email || '',
        password: parsedJugador2.password || '',
        password_confirmation: parsedJugador2.password_confirmation || parsedJugador2.password_confirm || '',
        juego_id: parsedJugador2.juego_id || (parsedJugador2.idjuego ? parseInt(parsedJugador2.idjuego, 10) : 0)
      };
      console.log('Jugadores de localStorage cargados y adaptados:', this.jugador1, this.jugador2);
    }
  }

  /**
   * Guarda los jugadores seleccionados en localStorage y navega a la página del juego.
   * Incluye validación básica.
   */
  jugar() {
    if (!this.jugador1.id || !this.jugador2.id) {
      this.errorMessage = 'Por favor, selecciona ambos jugadores para comenzar el juego.';
      return;
    }

    // Guarda los objetos de jugador completos (con la nueva estructura) en localStorage
    localStorage.setItem('jugador1', JSON.stringify(this.jugador1));
    localStorage.setItem('jugador2', JSON.stringify(this.jugador2));

    this.router.navigate(['/juego']);
  }

  /**
   * Navega de vuelta a la página de inicio.
   */
  volver() {
    this.router.navigate(['/']);
  }

}
