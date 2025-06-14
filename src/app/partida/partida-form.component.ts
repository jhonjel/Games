import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../usuarios/usuario.model';
import { Partida } from '../models/partida.model';
import { PartidaService } from '../service/partida.service';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-partida-form',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './partida-form.component.html',
  styleUrls: ['./partida-form.component.sass']
})
export class PartidaFormComponent implements OnInit {
  usuarios: Usuario[] = [];
  jugador1Id!: number;
  jugador2Id!: number;

  constructor(
  private readonly partidaService: PartidaService,
  private router: Router
) {}


  ngOnInit(): void {
    this.usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  }

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

}
