import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    primerNombre: ["",],
    segundoNombre: ["",],
    primerApellido: ["",],
    segundoApellido: ["",]
  });

  @Output() private usuarioAgregado = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router, private snack: MatSnackBar, private toastr: ToastrService) { }

  crearUsuario() {
    this.formSubmitted = true;
    // console.log(this.registerForm.value);

    if (this.registerForm.invalid) {
      return;
    }

    /** Realizar el posteo del formulario */
    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe(resp => {
        this.toastr.success('Usuario guardado con exito', '', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-right',
        });
        
        // Navegar al Dashboard
        // this.router.navigateByUrl('/auth/admin');
        this.usuarioAgregado.emit(true)

      }, (err) => {
        this.toastr.error(err.error.msg, '', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-right',
        });

      });

  }

}
