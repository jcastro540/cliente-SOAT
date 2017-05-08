export class User{
	constructor(
		public _id: string,
		public tipoDoc:string,
		public numDoc: string,
		public nombre: string,
		public apellido: string,
		public email: string,
		public telefono: string,
		public role: string,
		public password?: string,
	){}

}