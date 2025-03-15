import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RegisterService } from '../../services/register.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  regUser = new Usuario();
  showPassword = false;

  errorMessage: string = '';
  errorUsername: string = '';
  errorDNI: string = '';
  errorEmail: string = '';
  errorPassword: string = '';

  constructor(private router: Router, private registerService: RegisterService) {}

  registrarUsuario(usuario: Usuario) {
    console.log('Datos a enviar:', usuario);
  
    this.registerService.registrarUsuario(usuario).subscribe(
      data => {
        console.log('Respuesta del servidor:', data);
        this.errorMessage = '';
        this.errorUsername = '';
        this.errorDNI = '';
        this.errorEmail = '';
        this.errorPassword = '';
        this.mostrarExito();
      },
      error => {
        this.errorMessage = '';
        this.errorUsername = '';
        this.errorDNI = '';
        this.errorEmail = '';
        this.errorPassword = '';
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
          switch (this.errorMessage) {
            case 'El username ya está en uso.':
              this.errorUsername = this.errorMessage;
              break;
            case 'El DNI ya está en uso.':
              this.errorDNI = this.errorMessage;
              break;
            case 'El email ya está registrado.':
              this.errorEmail = this.errorMessage;
              break;
            case 'Coloque un email aceptable.':
              this.errorEmail = this.errorMessage;
              break;
            case 'La contraseña debe tener 8 o mas caracteres.':
              this.errorPassword = this.errorMessage;
              break;
            case 'La contraseña debe contener al menos una letra mayúscula.':
              this.errorPassword = this.errorMessage;
              break;  
            case 'La contraseña debe contener al menos un número.':
              this.errorPassword = this.errorMessage;
              break;
            case 'La contraseña debe contener al menos un carácter especial.':
              this.errorPassword = this.errorMessage;
              break;
            default:
              this.errorMessage = 'Ocurrió un error inesperado.';
          }
        } else {
          this.errorMessage = error.error.message;
        }
        this.mostrarError();
      }
    );
  }
  
  mostrarExito() {
    Swal.fire({
      title: "Registro exitoso!",
      html: "Serás redirigido al Login",
      timer: 2500,
      icon: "success",
      timerProgressBar: true,
      showConfirmButton: false,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }
    }).then(() => {
      this.router.navigate(['login']);
    });
  }

  mostrarError() {
    Swal.fire({
      title: "Error en el registro",
      text: this.errorMessage,
      icon: "error",
    });
  }
  
  login() {
    this.router.navigate(['login']);
  }

  /** ojito para visibilidad de contraseña */
  ojito() {
    this.showPassword = !this.showPassword;
  }
}