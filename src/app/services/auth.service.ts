import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import {Router, NavigationEnd} from "@angular/router";
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Usuario } from '../models/user.model';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  /* Verificar el status de el Usuario definido como observable */
  public loginStatusSubjec = new Subject<boolean>();

  //Objeto para comunicarse entre componentes suscritos al servicio
  public $logged = new BehaviorSubject<boolean>(false);
   //Objeto para comunicarse entre componentes suscritos al servicio
   public $refresh = new BehaviorSubject<boolean>(false);

  /* Verificar el estado del token para comprobar si esta Logueado o No */
  public isLoggedIn() {
    let tokenStr = localStorage.getItem('token');
    if (tokenStr == undefined || tokenStr == '' || tokenStr == null) {
      return false;
    } else {
      return true;
    }
  }

  /* Obtener el  TOKEN*/
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  /* Obtener el header para validacion */
  private globalHeaders = new HttpHeaders({ authorization: this.token});

  constructor(private http: HttpClient, private router: Router) {}

  //Objeto para comunicarse entre componentes suscritos al servicio
  public $refreshNav = new BehaviorSubject<boolean>(false);

  /* Funcion de Login */
  login(formData: any) {
    // console.log(formData);
    return this.http.post(`${base_url}/usuario/login`, formData)
      .pipe(
        tap((resp: any) => {
          // console.log(resp);

          localStorage.setItem('token', resp.token);
          localStorage.setItem('tipo', resp.tipo);
          localStorage.setItem('usuario', JSON.stringify(resp.username));
        })
      );
  }

  /* Funcion Logout */
  logout() {
    localStorage.clear();

    this.router.navigateByUrl('/login');
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.router.url === '/login') {
        window.location.reload();
      }
    });

  }

  profile(currToken: string): Observable<void> {
    const headers = new HttpHeaders({ authorization: currToken});
    return this.http.get<void>(`${base_url}/usuario/profile`, { headers });
  }

  changePassword(data: any): Observable<void> {
    const headers = this.globalHeaders
    return this.http.post<void>(`${base_url}/usuario/changePassword`, { data }, { headers });
  }

  // Crear al ADMIN-GOD si no existe un user con tipo = 0
  init(): Observable<void> {
    const headers = this.globalHeaders;
    return this.http.get<void>(`${base_url}/usuario/init`, { headers });
  }


}
