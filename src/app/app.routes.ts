import { Routes } from '@angular/router';
import { BoardComponent } from './components/board/board.component';
import { IniciarComponent } from './components/iniciar/iniciar.component';
import { RegistrarComponent } from './components/registrar/registrar.component';

export const routes: Routes = [
  { path: '', component: IniciarComponent },
  { path: 'registrar', component: RegistrarComponent },
  { path: 'juego', component: BoardComponent },
  { path: 'registro', component: RegistrarComponent },
];
