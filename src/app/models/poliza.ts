export class Poliza{
	constructor(
		public _id: string,
		public placa:string,
		public clase: string,
		public subtipo: number,
		public fechaInicio: Date,
		public fechaVen: Date,
		public tasa: number,
		public valorPrima: number,
		public fosyga: number,
		public subtotal: number,
		public total: number,
		public user: any,
		public pago: any,
		public emailUser?:any
	){}

}