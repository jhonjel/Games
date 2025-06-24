import { Component } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.sass']
})
export class RegistrarComponent {
  usuario: Omit<Usuario, 'id'> = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    juego_id: 'de5b558c-964c-4929-ab1e-343500c792d4' // Puedes asignarlo desde un juego seleccionado, si aplica
  };

  mensaje: string = '';

  constructor(private usuariosService: UsuariosService) {}

  registrarUsuario(): void {
    this.usuariosService.crearUsuario(this.usuario).subscribe({
      next: (res) => {
        this.mensaje = 'Usuario registrado correctamente ✅';
        this.usuario = {
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          juego_id: 'de5b558c-964c-4929-ab1e-343500c792d4'
        };
      },
      error: (err) => {
        this.mensaje = 'Error al registrar el usuario ❌';
        console.error(err);
      }
    });
  }
}

