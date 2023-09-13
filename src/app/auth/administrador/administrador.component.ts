import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/user.model';
import { AdminService } from 'src/app/services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})

export class AdministradorComponent implements OnInit {

  public loading: boolean // mostrar el icono de cargar
  constructor(private adminSrv: AdminService, private dialog: MatDialog, private toast: ToastrService, ){
    this.loading = true
  }

  usuarios: Usuario[] = [] // Todos los usuarios
  dataSource = new MatTableDataSource(this.usuarios);
  loggedUser: string = '' //Nombre del usuario logeado
  
  displayedColumns: string[] = ['Admin', 'Nombre', 'Nombre de Usuario', 'Fec. Creación', 'Estado','Bloqueo', 'Contraseña', 'Editar', 'Eliminar'];
  
  ngOnInit(): void {
    this.cargarUsuarios()
    this.hideLoader()

    this.loggedUser = localStorage.getItem('usuario')?.replace(/"+/g,'') || ''
  }
  
  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    let match: Usuario[] = []
    for (let i = 0; i < this.usuarios.length; i++) {
      const fechaUTC = this.usuarios[i].fechaCreacion.substring(0, 10).split('-')
      const horaUTC = this.usuarios[i].fechaCreacion.substring(11, 16).split(':')
      console.log(horaUTC);
      const horaLocal = parseInt(horaUTC[0]) - 6
      let dia = parseInt(fechaUTC[2])
      let mes = parseInt(fechaUTC[1])
  
      if (horaLocal < 0) {
        console.log('dia anterior');
        dia = parseInt(fechaUTC[2]) - 1
        if (dia < 0) {
          mes = parseInt(fechaUTC[1]) - 1
        }
      }

      const f = (dia < 10 ? '0'+dia.toString() : dia.toString()) + '/' + (mes < 10 ? '0'+mes.toString() : mes.toString()) + '/' + fechaUTC[0]
      console.log(f);
 
      if (this.usuarios[i].userName.toLowerCase().includes(filterValue) ||
          this.usuarios[i].primerNombre.toLowerCase().includes(filterValue) ||
          this.usuarios[i].primerApellido.toLowerCase().includes(filterValue) ||
          f.includes(filterValue) ) {
        
            match.push(this.usuarios[i])
      }
    }

    this.dataSource = new MatTableDataSource(match);
    match = []
  }
  
  cargarUsuarios(){
    this.adminSrv.getUsers()
    .subscribe((resp:any) => {
      this.usuarios = resp.result
      this.dataSource = new MatTableDataSource(this.usuarios);
    }, (err)=> {
      console.warn(err) 
      this.toast.error(err.error.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    })
  }

  async deleteUser(usuario: Usuario){

    if (usuario.tipo == 0 && this.loggedUser != 'ADMIN') {
      this.toast.error('Un Administrador no puede BORRAR a otro Administrador, ni a sí mismo', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      return
    }

    const id = usuario._id

    const { isConfirmed } = await Swal.fire({
      title: '¿Borrar al Usuario '+ usuario.userName +'?',
      showCancelButton: true
    })

    if (isConfirmed) {
      this.adminSrv.deleteUser(id)
      .subscribe((res:any) => {
        this.toast.success(res.msg + ' ' + usuario.userName, '', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-right',
        });
        this.cargarUsuarios()
      }, (err)=> {
        console.warn(err) 
        this.toast.error(err.error.msg, '', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-right',
        });
      })
    }
  }


  async resetPassword(id: string, userName: string){
    const { isConfirmed } = await Swal.fire({
      title: '¿Resetear la contraseña del Usuario "'+ userName +'"?',
      showCancelButton: true
    })

    if (isConfirmed) {
      this.adminSrv.resetPassword(id)
      .subscribe((res:any) => {
        Swal.fire(res.msg, 'Completado')
        this.cargarUsuarios()
      }, (err)=> {
        console.warn(err) 
        this.toast.error(err.error.msg, '', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-right',
        });
      })
    }
  }

  changeState(usuario: Usuario){

    if (usuario.activo && usuario.tipo == 0 && this.loggedUser != 'ADMIN') {
      this.toast.error('Un Administrador no puede INACTIVAR a otro Administrador, ni a sí mismo', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      return
    }

    const id = usuario._id

    this.adminSrv.changeState(id)
    .subscribe((res:any) => {

      this.toast.success(res.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
     
      this.cargarUsuarios()

    }, (err)=> {
      console.warn(err) 
      this.toast.error(err.error.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    })
  }

  unlock(usuario: Usuario){
    if (!usuario.bloqueado && usuario.tipo == 0 && this.loggedUser != 'ADMIN') {
      this.toast.error('Un Administrador no puede BLOQUEAR a otro Administrador, ni a sí mismo', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      return
    }

    const id = usuario._id

    this.adminSrv.unlock(id)
    .subscribe((res:any) => {
      this.toast.success(res.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      this.cargarUsuarios()
    }, (err)=> {
      console.warn(err) 
      this.toast.error(err.error.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    })
  }
  
  openDialog(usuario: Usuario): void {

    if (usuario.tipo == 0 && this.loggedUser != 'ADMIN') {
      this.toast.error('Un Administrador no puede EDITAR a otro Administrador, ni a sí mismo', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      return
    }

    const id = usuario._id

    this.adminSrv.getUser(id)
    .subscribe((res:any) => {
      const usuario = res.user

      //Abrir el Dialog con la inof
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          userName: usuario.userName,
          primerNombre: usuario.primerNombre,
          segundoNombre: usuario.segundoNombre,
          primerApellido: usuario.primerApellido,
          segundoApellido: usuario.segundoApellido,
          email: usuario.email,
          passCaducidad: usuario.passCaducidad + " (Faltan " + usuario.dias + " días)",
          _id: id,
          tipo: usuario.tipo
        },
      });
  
      dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed');
        this.cargarUsuarios()
      });
    }, (err)=> {
      console.warn(err) 
      this.toast.error(err.error.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    })
  }

  hideLoader(){
    setTimeout(()=>{
      document.querySelector(".loader")?.classList.add("loader--hidden")
    },1500)
  }

}

