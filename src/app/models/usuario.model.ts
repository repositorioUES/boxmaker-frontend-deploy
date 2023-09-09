export class Usuario {

    constructor(
        public primerNombre: string,
        public segundoNombre: string,
        public primerApellido: string,
        public segundoApellido: string,
        public email: string,
        public password?: string,
        ){}

}