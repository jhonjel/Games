import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Partida } from '../../models/partida.model';

@Component({
  selector: 'app-partidas-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Historial de Partidas</h2>
    <ul>

    </ul>
  `
})
export class PartidasListComponent implements OnInit {
  partidas: Partida[] = [];

  ngOnInit(): void {
    this.partidas = JSON.parse(localStorage.getItem('partidas') || '[]');
  }
}
