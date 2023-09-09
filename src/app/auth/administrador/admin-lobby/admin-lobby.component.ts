import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PasswordDialogComponent } from '../../password-dialog/password-dialog.component';

@Component({
  selector: 'app-admin-lobby',
  templateUrl: './admin-lobby.component.html',
  styleUrls: ['./admin-lobby.component.css']
})
export class AdminLobbyComponent implements OnInit{

  constructor(private router: Router, private authSrv: AuthService, private toast: ToastrService, private dialog: MatDialog){}
  
  fakeUser: Usuario =({
    primerNombre: 'Jhon', 
    segundoNombre: 'Doe', 
    primerApellido: 'fake', 
    segundoApellido: 'User', 
    email: 'fake', 
    userName: 'fake', 
    fechaCreacion: 'fake', 
    passCaducidad: 'fake', 
    _id: 'fake', 
    activo: 'fake', 
    bloqueado: 'fake', 
    tipo: 2, 
  })
  
  iconNumber: number = 0
  loggedUser: Usuario = this.fakeUser // Usuario ficticio solo para la inicializacion de datos
  daysLeft: number = 0 // Días restantes hasta que caduque la contraseña
  expiration: string = '' // Mensaje y fecha de vencimiento de contraseña

  // Se suscribe para detecter cada vez que la variable $refreshTable cambie
  refresh = this.authSrv.$refresh.subscribe(() => {
    this.getProfile()
  });

  ngOnInit(): void {
    this.getProfile()
    this.authSrv.$refreshNav.next(true); //Emitir que se debe refrescar la tabla del home.component

    this.hideLoader()
  }

  getProfile(){
    const currToken = localStorage.getItem('token') || ''
    
    this.authSrv.profile(currToken)
    .subscribe((resp:any) => {
      this.loggedUser = resp.userData
      this.daysLeft = resp.warning.dias
      this.expiration = resp.warning.fecha

    }, (err)=> {
      console.warn(err) 
      this.toast.error(err.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    })
  }

  changePassword(): void {

      //Abrir el Dialog con la inof
      const dialogRef = this.dialog.open(PasswordDialogComponent, {
        data: {
          userName: this.loggedUser.userName,
          primerNombre: this.loggedUser.primerNombre,
          segundoNombre: this.loggedUser.segundoNombre,
          primerApellido: this.loggedUser.primerApellido,
          segundoApellido: this.loggedUser.segundoApellido,
          email: this.loggedUser.email,
          passCaducidad: this.loggedUser.passCaducidad + " ( " + this.daysLeft + ")",
          _id: this.loggedUser._id
        },
      });
  
      dialogRef.afterClosed().subscribe(() => {
        // console.log('The dialog was closed');
        this.getProfile()
      })
  }

  toUsers(){
    this.router.navigateByUrl('/auth/admin');
  }

  toDefineBox(){
    this.router.navigateByUrl('/');
  }

  toBoxes(){
    this.router.navigateByUrl('/auth/cajas');
  }

  showIcon(icon: string){

    if (icon == 'users') {
      this.iconNumber = 1
    }
    if (icon == 'contents') {
      this.iconNumber = 2
    }
    if (icon == 'boxes') {
      this.iconNumber = 3
    }
    
    if (icon == 'admin') {
      this.iconNumber = 4
    }
  }

  celIcon(){
    this.iconNumber = 0
  }

  hideLoader(){

    setTimeout(()=>{
      document.querySelector(".loader")?.classList.add("loader--hidden")
    },1500)

  }

}
