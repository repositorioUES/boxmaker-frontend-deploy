import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

export interface DialogData {
  password: string;
  newPassword: string;
  primerNombre: string, 
  segundoNombre: string, 
  primerApellido: string, 
  segundoApellido: string, 
  email: string, 
  userName: string, 
  fechaCreacion: string, 
  passCaducidad: string, 
  _id: string, 
  activo: string, 
  bloqueado: string, 
}

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styles: [],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, DatePipe],
})

export class PasswordDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private authSrv: AuthService,
    private toast: ToastrService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  changePassword(data: any){
    this.authSrv.changePassword(data)
    .subscribe((resp:any) => {
      this.toast.success(resp.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      this.authSrv.$refresh.next(true); //Emitir que se debe refrescar la tabla del CAJA.component
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

  nextInput(next: any, key: any) {
    if (key == 13) {
      document.getElementById(next)?.focus();
    }
  }
  
}
