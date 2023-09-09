import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  private globalHeaders = new HttpHeaders({'authorization': this.token});

  getUsers () : Observable<Usuario[]>{
    const headers = this.globalHeaders
    return this.http.get<Usuario[]>(`${ base_url }/usuario/all`, {headers})
  }

  getUser (id: string) : Observable<Usuario>{
    const headers = this.globalHeaders
    return this.http.get<Usuario>(`${ base_url }/usuario/one/${ id }`, {headers})
  }

  updateUser (id: string, data: any) : Observable<void>{
    const headers = this.globalHeaders
    return this.http.put<void>(`${ base_url }/usuario/edit/${ id }`, data, {headers})
  }

  deleteUser (id: string) : Observable<void>{
    const headers = this.globalHeaders
    return this.http.delete<void>(`${ base_url }/usuario/delete/${ id }`, {headers})
  }

  changeState (id: string) : Observable<void>{
    const headers = this.globalHeaders
    return this.http.get<void>(`${ base_url }/usuario/changeState/${ id }`, {headers})
  }

  unlock (id: string) : Observable<void>{
    const headers = this.globalHeaders
    return this.http.get<void>(`${ base_url }/usuario/unlock/${ id }`, {headers})
  }

  resetPassword (id: string) : Observable<void>{
    const headers = this.globalHeaders
    return this.http.get<void>(`${ base_url }/usuario/resetPassword/${ id }`, {headers})
  }

}
