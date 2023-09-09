import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router,NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { timeInterval } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  public loginForm = this.fb.group({
    userName: ["", ],
    password: ["", ],
  });

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private snack: MatSnackBar, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.init() // Disparar al terminar de cargar el componente

    this.hideLoader()
  }


  login() {
    this.authService.login(this.loginForm.value)
      .subscribe(resp => {
        if (resp.ok === true) {

          if(resp.tipo == 0)
            this.router.navigateByUrl('/auth/admin-lobby');
          else
            this.router.navigateByUrl('/auth/user-lobby');

          this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd && this.router.url === '/') {
              window.location.reload();
            }
          });
        }else{
          this.toastr.error(resp.msg, '', {
            timeOut: 5000,
            progressBar: true,
            progressAnimation: 'decreasing',
            positionClass: 'toast-top-right',
          });
        }

      }, (err) => {
        console.warn(err.error.msg);
        this.toastr.error(err.error.msg, '', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-right',
        });
      });
  }



  // Crear al ADMIN-GOD si no existe un user con tipo = 0
  init(){
    this.authService.init()
    .subscribe((resp:any) => {
      this.toastr.success(resp.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    }, (err)=> {
        console.warn(err)
    })
  }

  hideLoader(){
    setTimeout(()=>{
      document.querySelector(".loader")?.classList.add("loader--hidden")
    },1500)
  }

}
