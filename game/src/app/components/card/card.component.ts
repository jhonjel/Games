import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.sass']
})
export class CardComponent {
  @Input() card!: Card;
  @Output() cardClicked = new EventEmitter<void>();

  onClick(): void {
    if (!this.card.revealed && !this.card.matched) {
      this.cardClicked.emit();
    }
  }
}

