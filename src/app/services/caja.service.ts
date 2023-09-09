import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {Router} from "@angular/router";
import { BehaviorSubject, Observable } from 'rxjs';
import { Caja } from '../models/caja.model';
import { Comprobante } from '../models/comprobante.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  //Objeto para comuncarse entre componentes suscritos al servicio
  public $refreshTable = new BehaviorSubject<boolean>(false);
  //Objeto para comuncarse entre componentes suscritos al servicio
  public $inserted = new BehaviorSubject<number>(-1);
  public $hasInserted = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router : Router) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  private globalHeaders = new HttpHeaders({'authorization': this.token});

  crearCaja(formData: any){
    const headers = this.globalHeaders
    return this.http.post(`${ base_url }/caja/create`, formData, {headers} )
  }

  cargarCaja(formData: any){
    const headers = this.globalHeaders
    return this.http.post(`${ base_url }/caja/one`, formData, {headers} )
}

  ingresarComprobantes(formData : any){
    const headers = this.globalHeaders
    return this.http.post(`${ base_url }/contenido/insert`, formData, {headers} )
  }

  reportePDF(codigo: string){
    const headers = this.globalHeaders
    const url = `${base_url}/caja/generatePDF/${codigo}`;
    /* console.log('URL de solicitud:', url); */
    return this.http.get(url, { headers });
  }





  getBoxes () : Observable<Caja[]>{
    const headers = this.globalHeaders
    return this.http.get<Caja[]>(`${ base_url }/caja/all`, {headers})
  }

  deleteBox (codigo: string) : Observable<void>{
    const headers = this.globalHeaders
    return this.http.delete<void>(`${ base_url }/caja/delete/${ codigo }`, {headers})
  }

  getPDF(codigo: string): Promise<any> {
    return fetch(`${ base_url }/caja/generatePDF/${ codigo }`, {
      method: 'GET',
    });
  }

  getXLSX(codigo: string): Promise<any> {
    return fetch(`${ base_url }/caja/generateExcel/${ codigo }`, {
      method: 'GET',
    });
  }

  deleteOneContent (caja: string, index: number) : Observable<void>{
    const headers = this.globalHeaders
    return this.http.post<void>(`${ base_url }/contenido/removeOne`, {caja, index}, {headers})
  }

  deleteAllContent (codigo: string) : Observable<void>{
    const headers = this.globalHeaders
    return this.http.delete<void>(`${ base_url }/contenido/deleteAll/${ codigo }`, {headers})
  }

  cargarContenido (codigo: string) : Observable<Comprobante[]>{
    const headers = this.globalHeaders
    return this.http.get<Comprobante[]>(`${ base_url }/caja/contenido/${ codigo }`, {headers})
  }

  savetoDatabase (codigo: string) : Observable<void>{
    const headers = this.globalHeaders
    return this.http.get<void>(`${ base_url }/contenido/save/${ codigo }`, {headers})
  }
}

