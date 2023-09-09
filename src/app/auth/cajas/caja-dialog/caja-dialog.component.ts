import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { Caja } from 'src/app/models/caja.model';
import { CajaService } from 'src/app/services/caja.service';


export interface DialogData {
  caja: Caja;
}

@Component({
  selector: 'app-caja-dialog',
  templateUrl: './caja-dialog.component.html',
  styleUrls: ['./caja-dialog.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, DatePipe],
})

export class CajaDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CajaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cajaSrv: CajaService,
    private toast: ToastrService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateBox(caja: Caja){
    this.cajaSrv.crearCaja(caja)
    .subscribe((resp:any) => {
      this.toast.success(resp.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      this.cajaSrv.$refreshTable.next(true); //Emitir que se debe refrescar la tabla del CAJA.component
    }, (err)=> {
        console.warn(err) 
        this.toast.error(err.msg, '', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-right',
        });
    })
    this.dialogRef.close();
  }

}
