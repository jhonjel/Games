import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Partida } from '../models/partida.model';
import { PartidaService } from '../service/partida.service';
import { UserService } from '../service/user.service';
import { Usuario } from '../usuarios/usuario.model';

@Component({
  selector: 'app-partida-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './partida-form.component.html',
  styleUrls: ['./partida-form.component.sass']
})
export class PartidaFormComponent implements OnInit {
  usuarios: Usuario[] = [];
  jugador1Id!: number;
  jugador2Id!: number;
  errorMessage: string = '';

  constructor(
    private partidaService: PartidaService,
    private usuariosService: UserService,
    public router: Router // CAMBIO CLAVE: 'router' debe ser público para ser usado en el HTML
  ) {}

  ngOnInit(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log('Usuarios cargados:', this.usuarios);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.errorMessage = 'No se pudieron cargar los usuarios.';
      }
    });
  }

<<<<<<< HEAD
  crearPartida(): void {
    const jugador1 = this.usuarios.find(u => u.id === this.jugador1Id);
    const jugador2 = this.usuarios.find(u => u.id === this.jugador2Id);

    if (!jugador1 || !jugador2) {
      this.errorMessage = 'Por favor selecciona ambos jugadores.';
      return;
    }

    if (jugador1.id === jugador2.id) {
      this.errorMessage = 'Selecciona dos jugadores diferentes.';
      return;
    }

    const nuevaPartida: Partida = {
      id: Date.now(),
      jugador1Id: jugador1.id,
      jugador2Id: jugador2.id,
      fecha: new Date().toISOString(),
      aciertos: {
        jugador1: 0,
        jugador2: 0
      }
    };

    this.partidaService.guardarPartida(nuevaPartida);
    this.partidaService.establecerPartidaActiva(nuevaPartida);
    this.router.navigate(['/partida']);
  }

  // Este método público no es estrictamente necesario si router es público en el constructor
  // y lo llamas directamente en el HTML como (click)="router.navigate(['/registrarme'])"
  // Sin embargo, si prefieres encapsular la lógica de navegación en un método, puedes mantenerlo.
  public navigateToRegistro(): void {
    this.router.navigate(['/registrarme']);
  }
=======
crearPartida() {
  if (this.jugador1Id === this.jugador2Id) {
    alert('Selecciona dos jugadores diferentes.');
    return;
  }

  const nuevaPartida: Partida = {
    id: Date.now(),
    juego_id: `${this.jugador1Id}-${this.jugador2Id}-${Date.now()}`, // crear un ID único
    fecha: new Date().toISOString(),
    tiempo: 0, // Inicia en 0, puedes actualizarlo en el tablero
    nivel: 'Fácil' // o el valor que selecciones
  };

  this.partidaService.guardarPartida(nuevaPartida);
  this.partidaService.establecerPartidaActiva(nuevaPartida);

  alert('¡Partida creada exitosamente!');
  this.router.navigate(['/partida']);
}

>>>>>>> 36b8b4629776517ed2d8e9889ffc151e42d9870c
}
