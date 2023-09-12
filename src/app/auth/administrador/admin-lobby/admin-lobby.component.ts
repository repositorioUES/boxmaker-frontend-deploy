import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PasswordDialogComponent } from '../../password-dialog/password-dialog.component';
import { getLocaleFirstDayOfWeek } from '@angular/common';


@Component({
  selector: 'app-admin-lobby',
  templateUrl: './admin-lobby.component.html',
  styleUrls: ['./admin-lobby.component.css']
})
export class AdminLobbyComponent implements OnInit{

  constructor(private router: Router, private authSrv: AuthService, private toast: ToastrService, private dialog: MatDialog){}
  
  /* Obtener el  TOKEN*/
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  /* Obtener el  userName*/
  get userInSession(): string {
    return localStorage.getItem('usuario') || '';
  }

  fakeUser: Usuario =({
    primerNombre: 'Jhon', 
    segundoNombre: 'Doe', 
    primerApellido: 'fake', 
    segundoApellido: 'User', 
    email: 'fake', 
    userName: this.userInSession, 
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
  // refresh = this.authSrv.$refresh.subscribe(() => {
  //   this.getProfile()
  // });

  ngOnInit(): void {
    this.getProfile()
    this.authSrv.$refreshNav.next(true); //Emitir que se debe refrescar la tabla del home.component

    this.hideLoader()
  }

  getProfile(){
    
    this.authSrv.profile(this.token)
    .subscribe((resp:any) => {
      this.loggedUser = resp.userData
      this.daysLeft = resp.warning.dias
      this.expiration = resp.warning.fecha

      if (resp.firstLogin == true &&  this.loggedUser.userName != 'ADMIN') {
        console.log('msg: ');
        this.changePassword('   Es necesario que Cambie su Contraseña') 
      }

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

  changePassword(msg: string): void {

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
          _id: this.loggedUser._id,
          firstLogin: msg
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
