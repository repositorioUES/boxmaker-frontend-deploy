import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/**Componentes de los formularios */
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

/**Componentes de angular */
import { MatButtonModule} from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatCardModule} from "@angular/material/card";
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import { AdministradorComponent } from './administrador/administrador.component';
import {MatTableModule} from '@angular/material/table';
import { DialogComponent } from './administrador/dialog/dialog.component';
import { AdminLobbyComponent } from './administrador/admin-lobby/admin-lobby.component';
import { CajasComponent } from './cajas/cajas.component';
import { UserLobbyComponent } from './user-lobby/user-lobby.component';
import { CajaDialogComponent } from './cajas/caja-dialog/caja-dialog.component';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AdministradorComponent,
    AdminLobbyComponent,
    CajasComponent,
    UserLobbyComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    DialogComponent,
    CajaDialogComponent,
    PasswordDialogComponent
  ],
  exports:[
    LoginComponent,
    RegisterComponent
  ]
})
export class AuthModule { }
