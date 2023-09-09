import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comprobante } from '../models/comprobante.model';

const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})

  export class QuedanService {
  
    constructor(private http: HttpClient) { }
  
    get token(): string {
      return localStorage.getItem('token') || '';
    }
  
    private globalHeaders = new HttpHeaders({'authorization': this.token});

    getQuedan( formData: any ): Observable<Comprobante[]> {
      const headers = this.globalHeaders
      return this.http.post<Comprobante[]>(`${ base_url }/comprobante/filter`, formData, {headers})
    }

    saveQuedan (caja: string, comprobantes: Comprobante[]) : Observable<void>{
      const headers = this.globalHeaders
      return this.http.post<any>(`${ base_url }/contenido/quedanInsert`, {caja, comprobantes}, {headers})
    }

}