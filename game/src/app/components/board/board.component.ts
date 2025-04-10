import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../models/card.model';
import { CardComponent } from "../card/card.component";

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
  scores: { [key: number]: number } = { 1: 0, 2: 0 };


  ngOnInit(): void {
    this.generateBoard();
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
        this.scores[this.currentPlayer]++;
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
}

