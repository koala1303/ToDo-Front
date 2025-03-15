import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, NavigationEnd, Router, RouterLinkActive } from '@angular/router';
import { LoginService } from './services/login.service';
import { ModalProyectoComponent } from './components/modal-proyecto/modal-proyecto.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ModalProyectoComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'front-proyecto-g3';
  verNav: boolean = true;
  userName: string | null = null;
  private userNameSubscription: Subscription;

  constructor(private router: Router, private loginService: LoginService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.verNav = event.url !== '/login' && event.url !== '/register';
      }
    });

    this.userNameSubscription = this.loginService.userName$.subscribe(name => {
      this.userName = name;
    });
  }

  ngOnInit(): void {
    this.userName = this.loginService.getUserName();
  }

  ngOnDestroy(): void {
    if (this.userNameSubscription) {
      this.userNameSubscription.unsubscribe();
    }
  }

  salir() {
    this.loginService.logout();
    window.location.href = '/login';
  }

  /**primera letra mayuscula del usuario */
  letraMayuscula(userName: string | null): string {
    if (!userName) {
      return 'Usuario';
    }
    return userName.charAt(0).toUpperCase() + userName.slice(1);
  }
  
}