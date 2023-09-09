
import { Component, EventEmitter, Inject, Output } from '@angular/core';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuedanService } from 'src/app/services/quedan.service';
import { Dialog } from '@angular/cdk/dialog';
import { Comprobante } from 'src/app/models/comprobante.model';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, NgForOf, NgFor, NgIf } from '@angular/common';
import { CajaService } from 'src/app/services/caja.service';


export interface DialogData {
  codigo: string;
  fInicio: string;
  fFinal: string;
  quedan: string;
}

@Component({
  selector: 'app-quedan',
  templateUrl: './quedan.component.html',
  styleUrls: [
    './quedan.component.css'
  ],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatCheckboxModule, DatePipe, NgForOf, NgFor, NgIf],
})

export class QuedanComponent {

  constructor(
    public dialogRef: MatDialogRef<QuedanComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: DialogData,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private quedanSrv: QuedanService,
    private cajaSrv: CajaService,
    private toast: ToastrService,
  ) {}

  elegidos: any[] = [] // Comprobantes seleccionados en el modal
  mainChecked: boolean = true // Para controlar el cehackbox que marca/desmarca a todos
  @Output() private comprobantesAgregados = new EventEmitter<any>();

  onNoClick(): void {
    this.dialogRef.close();
  }

  getQuedan(quedan: string, fInicio: string, fFinal: string){

    if (new Date(fInicio) >= new Date(fFinal)) {
      console.warn('La fecha de inicio debe ser menor que la fecha final')
      this.toast.error('La fecha de inicio debe ser menor que la fecha final', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      return
    }

    if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(fInicio) == false){
      console.warn('La fecha de Inicio No tiene formato válido')
      this.toast.error('La fecha de Inicio No tiene formato válido', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      return
    }

    if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(fFinal) == false){

      console.warn('La fecha Final No tiene formato válido')
      this.toast.error('La fecha Final No tiene formato válido', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      return
    }

    if (quedan == null || quedan == "") {
      console.warn('El QUEDAN es obligatorio')
      this.toast.error('El QUEDAN es obligatorio', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      return
    }

    const datos = {
      fInicio: fInicio,
      fFinal: fFinal,
      quedan: quedan
    }

    // const datos = {
    //   fInicio: '2023-07-01',
    //   fFinal: '2023-07-31',
    //   quedan: '123456'
    // }

    this.quedanSrv.getQuedan(datos)
    .subscribe((resp:Comprobante[]) => {

      if(resp.length == 0){
        this.toast.error('No se encontraron comprobantes que cumplan con el filtro', '', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-right',
        });
        return
      }

      this.elegidos = []
      resp.forEach(comprobante => {
        const compAux = {
          comprobante: comprobante,
          marked: true,
          fecha: this.formatedDate(comprobante.fecha)
        }
        this.elegidos.push(compAux)
        this.mainChecked = true
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

  // Marcar los checkboxes de maera individual
  selectedItems(comp: any){

    this.elegidos.forEach(e => {
      if (e.comprobante._id == comp.comprobante._id) {
        e.marked = !e.marked
      }
    })

    if (this.getMarks() == this.elegidos.length) {
      this.mainChecked = true
    } else {
      this.mainChecked = false
    }
  }

  // Marcar-Desmarcar todos los checkboxes
  toggleAll(){

    if (this.getMarks() == this.elegidos.length) {
        this.elegidos.forEach(e => {
          e.marked = false
        })
        this.mainChecked = false
      } else {
        this.elegidos.forEach(e => {
          e.marked = true
        })
        this.mainChecked = true
    }
  }

  trasladar(codigo: string){
    let toSave: Comprobante[] = [] //Comprobantes que tienen marcado el check y que se guardarán

    this.elegidos.forEach(e => {
      if (e.marked) {
        toSave.push(e.comprobante)
      }
    });

    if (toSave.length == 0) {
      this.toast.error('No hay Comprobantes seleccionados para Trasladar', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      return
    }

    this.quedanSrv.saveQuedan(codigo, toSave)
    .subscribe((res:any) => {
      this.toast.success(res.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      this.cajaSrv.$refreshTable.next(true); //Emitir que se debe refrescar la tabla del home.component
      this.onNoClick() // cerrar dialog depues de trasladar
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



// FUNCIONES DE APOYO PARA CONTROLAR LOS CHECKBOXES MARCADOS===========================================================================
  //Obtener la cantidad de comprobantes marcados en la lista
  getMarks(){
    let marked = 0 // Cantidad de filas marcadas

    this.elegidos.forEach(e => {
      if (e.marked) {
        marked++
      }
    })
    return marked
  }

  // Formatear la fecha como dd/mm/yyyy (proque Pipe no lo hace bien XD)
  formatedDate(fecha: string){
    let splitFecha = fecha.substring(0, 10).split("-")
    return splitFecha[2] + "/" + splitFecha[1] + "/" + splitFecha[0]
  }


  sh(){
    let toSave: Comprobante[] = []
    this.elegidos.forEach(e => {
      if (e.marked) {
        toSave.push(e.comprobante)
      }
    });
    console.log(toSave.length);
  }

  nextInput(next: any, key: any) {
    if (key == 13) {
      document.getElementById(next)?.focus();
    }

  }

}
