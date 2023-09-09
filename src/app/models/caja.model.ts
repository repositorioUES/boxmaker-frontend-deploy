

export class Caja {
    constructor(
        public fechaCreacion : string,
        public entidad : string,
        public grupo : string,
        public numero : number,
        public codigo : string,
        public descripcion: string,
        public estante : number,
        public nivel : number,
        public caducidad : number,
        public usuario : string,
        public _id: number,
    ) {}
}
