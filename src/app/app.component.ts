import { Component } from '@angular/core';
import { IniciarComponent } from './components/iniciar/iniciar.component';

@Component({
  selector: 'app-root',
  imports: [ IniciarComponent ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  standalone: true
})
export class AppComponent {
  title = 'game';
}
