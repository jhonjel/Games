import { Component } from '@angular/core';
import { BoardComponent } from './components/board/board.component';

@Component({
  selector: 'app-root',
  imports: [ BoardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  standalone: true
})
export class AppComponent {
  title = 'game';
}
