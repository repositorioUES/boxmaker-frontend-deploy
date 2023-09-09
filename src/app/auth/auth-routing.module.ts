import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdministradorComponent } from './administrador/administrador.component';
import { AdminLobbyComponent } from './administrador/admin-lobby/admin-lobby.component';
import { CajasComponent } from './cajas/cajas.component';
import { UserLobbyComponent } from './user-lobby/user-lobby.component';
import {authGuard} from "../guards/auth.guard";


const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [authGuard]
  },
  {
    path: "admin",
    component: AdministradorComponent,
    canActivate: [authGuard]
  },
  {
    path: "admin-lobby",
    component: AdminLobbyComponent,
    canActivate: [authGuard]
  },
  {
    path: "user-lobby",
    component: UserLobbyComponent,
    canActivate: [authGuard]
  },
  {
    path: "cajas",
    component: CajasComponent,
    canActivate: [authGuard]
  },
  {
    path: "**",
    redirectTo: "login"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
