

export class Usuario {
    constructor(
       public primerNombre: string, 
       public segundoNombre: string, 
       public primerApellido: string, 
       public segundoApellido: string, 
       public email: string, 
       public userName: string, 
       public fechaCreacion: string, 
       public passCaducidad: string, 
       public _id: string, 
       public activo: string, 
       public bloqueado: string, 
       public tipo: number, 
    ) {}
}