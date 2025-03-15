import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  cargando: boolean = false; //animacion cargando
  showPassword = false;

  credenciales = {
    email: '',
    password: ''
  };

  error = '';

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  login() {
    if (this.credenciales.email && this.credenciales.password) {
      this.error = '';
    }

    this.loginService.login(this.credenciales).subscribe({
      next: (response) => {
        const token = response.headers.get('Authorization');
        if (token) {
          this.cargando = true;
          this.loginService.saveToken(token.replace('Bearer ', ''));
          console.log('Login exitoso - Token recibido');

          setTimeout(() => {
            this.cargando = false;
            this.router.navigate(['/proyecto']);
          }, 2000);
        }
      },

      error: (err) => {
        this.cargando = false;
        this.error = 'Credenciales inválidas';
        console.error('Error en login:', err);
      }
    });
  }

  /** Navegar a la página de register */
  register() {
    this.router.navigate(['register']);
  }

  /**ojito para visibilidad de contraseña */
  ojito() {
    this.showPassword = !this.showPassword;
  }
}