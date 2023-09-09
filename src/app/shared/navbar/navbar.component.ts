import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import { interval } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  /* Colocar el nombre del usuario en el Navbar sin comillas */
  usuario = (localStorage.getItem('usuario') || '').replace(/"/g, '')
  tipo = (localStorage.getItem('tipo') || '')

  /* Colocar la fecha actual en el Navbar  */
  currentTime!: Date;

  /* Inicializar el estado del usuario */
  isLoggedIn = false;

  constructor(private authService : AuthService,  private router: Router) {}

  /* Funcion para hacer logout y set el usuario en "" */
  logout(){
    this.authService.logout();
    this.usuario = "";
  }


  ngOnInit(): void {

    this.currentTime = new Date();

    /* Permite verificar el estado del usuario mediante su status */
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.authService.isLoggedIn();
      }
    )

    // Se suscribe para detectar cada vez que la variable $refreshTable cambie
    this.authService.$refreshNav.subscribe(data => {
      this.isLoggedIn = this.authService.isLoggedIn();
      this.usuario = (localStorage.getItem('usuario') || '').replace(/"/g, '')
    });

  }

}
