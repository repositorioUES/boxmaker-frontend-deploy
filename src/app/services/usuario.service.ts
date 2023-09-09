import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  private globalHeaders = new HttpHeaders({'authorization': this.token});

  crearUsuario( formData: any ) {
    const headers = this.globalHeaders
    return this.http.post(`${ base_url }/usuario/register`, formData, {headers})
  }

}
