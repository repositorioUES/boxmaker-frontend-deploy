

export class Comprobante {
    constructor(
       public caja: string,
       public quedan: string,
       public tipo: string,
       public clave: string,
       public fecha: string,
       public correlativo: string,
       public _id: string,
    ) {}
}