import { Routes } from '@angular/router';
import { IniciarComponent } from './components/iniciar/iniciar.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { BoardComponent } from './components/board/board.component';

export const routes: Routes = [
  { path: '', component: IniciarComponent },
  { path: 'iniciar', component: IniciarComponent },
  { path: 'registrar', component: RegistrarComponent },
  { path: 'juego', component: BoardComponent },
];
