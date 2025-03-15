import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private loginService: LoginService,
        private router: Router
    ) { }

    canActivate(): boolean {
        if (this.loginService.getToken()) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}