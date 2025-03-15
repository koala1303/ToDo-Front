import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './components/login/helpers/auth.guard';
import { ProyectoComponent } from './components/proyecto/proyecto.component';
import { TareaComponent } from './components/tarea/tarea.component';
import { ProyectoDetalleComponent } from './components/proyecto-detalle/proyecto-detalle.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    { path: 'proyecto', component: ProyectoComponent, canActivate: [AuthGuard] },
    { path: 'proyecto-detalle/:id', component: ProyectoDetalleComponent },
    { path: 'tarea', component: TareaComponent, canActivate: [AuthGuard] },

    { path: '', redirectTo: '/login', pathMatch: 'full' }
];


