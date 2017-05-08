export class Pago{
	constructor(
		public _id: string,
		public numeroTdc:number,
		public nombreTitular: string,
		public fechaVen: Date,
		public cvv: string,
		public numCuotas: number
	){}

}