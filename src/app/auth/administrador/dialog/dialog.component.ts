
import { Component, Inject } from '@angular/core';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';

export interface DialogData {
  userName: string;
  primerNombre: string; 
  segundoNombre:string;
  primerApellido: string;
  segundoApellido: string; 
  email: string; 
  passCaducidad: string;
  _id: string;
  password: string;
  confirmPassword: string;
  tipo : number;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatCheckboxModule, NgIf],
})
export class DialogComponent {

  public checked: boolean = false

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private adminSrv: AdminService,
    private authSrv: AuthService,
    private toast: ToastrService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }


  upadateUser(recivedData: any){
    
    const data = ({
      primerNombre: recivedData.primerNombre,
      segundoNombre: recivedData.segundoNombre,
      primerApellido: recivedData.primerApellido,
      segundoApellido: recivedData.segundoApellido,
      password: recivedData.password,
      confirmPassword: recivedData.confirmPassword,
      admin: localStorage.getItem('usuario')?.replace(/"+/g, ''),
      tipo: recivedData.tipo,
      
    })

    if (this.checked && !data.password && !data.confirmPassword) {
      this.toast.error('Debe ingresar su contraseña para convertir a un Administrador', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      return
    }
    this.adminSrv.updateUser(recivedData._id, data)
    .subscribe((resp:any) => {
      this.toast.success(resp.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });

      this.authSrv.$refresh.next(true); //Emitir que se debe refrescar la tabla del home.component
    }, (err)=> {
        console.warn(err) 
        this.toast.error(err.error.msg, '', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-right',
        });
    })
    this.dialogRef.close();

  }

  onChange(){
    this.checked = !this.checked
  }

  nextInput(next: any, key: any) {
    if (key == 13) {
      document.getElementById(next)?.focus();
    }
  }
}
