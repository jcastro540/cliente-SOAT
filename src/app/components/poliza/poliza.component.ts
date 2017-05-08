import { Component, OnInit } from '@angular/core';
import { Poliza } from '../../models/poliza';
import { User } from '../../models/user.model';
import { Pago } from '../../models/pago.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PolizaService } from '../../services/poliza.service';
import { UserService } from '../../services/user.service';
import { PagoService } from '../../services/pago.service';
import { EmailService } from '../../services/email.service';



@Component({
  selector: 'app-poliza',
  templateUrl: './poliza.component.html',
  styles: []
})
export class PolizaComponent implements OnInit {

  // public placa:string ="";
  public pago:Pago = new Pago('',null,'',null,'',null);

  public inicio = new Date();
  public calc = new Date().setFullYear(new Date().getFullYear() + 1);
  public fin = new Date(this.calc)

  public poliza:Poliza;
  public message:string;
  public mensaje:string;

  public polizaId:string;
  public user:User;


  public pagoId:string = '590f45cf89f8a4451c4fdbdf';

  public clases:Array<string> = ['MOTOS', 
  								 'CAMPEROS Y CAMIONETAS', 
  								 'CARGA O MIXTO', 
  								 'OFICIALES ESPECIALES',
  								 'AUTOS FAMILIARES',
  								 'VEHICULOS PARA SEIS O MAS PASAJEROS',
  								 'AUTOS DE NEGOCIOS Y TAXIS',
  								 'BUSES Y BUSETAS DE SERVICIO PUBLICO URBANO',
  								 'SERVICIO PUBLICO INTERMUNICIPAL'];
  public tipoDocumento:Array<string> = ['E','P','G'];

  public claseCapturada:any;
  public subtipoCapturado:any;

  //efectos
  public visiblePoliza:boolean = true;
  public visibleTomador:boolean = false;
  public visiblePago:boolean = false;

  constructor(
  		public router:Router,
  		public activatedRoute:ActivatedRoute,
  		public _authService:AuthService,
  		public _polizaService:PolizaService,
  		public _userService:UserService,
  		public _pagoService:PagoService,
  		public _emailService:EmailService

  	) { 

  		// console.log(this._authService.usuarioLogeado._id)
  		this.user = this._authService.usuarioLogeado;
  		this.poliza = new Poliza('','','',null,this.inicio,this.fin,null,null,null,null,null,'',this.pago._id,this._authService.usuarioLogeado.email); 
  		console.log(this.poliza)
  }

  ngOnInit() {
  	this.poliza.user = this.user._id;
  	// this.poliza.pago= this.pagoId;
  }

  siguiente(){
  	this.visibleTomador = true;
  	this.visiblePoliza = false;
  }

  agregarPoliza(){
  	  	this._polizaService.addPoliza(this.poliza).subscribe(

  			result=>{
  				if(result.message) {
						this.message = result.message;
						//console.log(this.message);
					}else{
						this.poliza = result.poliza;
						this.visibleTomador = true;
  						this.visiblePoliza = false;
						this.poliza.user = this.user._id;
						this.router.navigate(['/poliza-detail', this.poliza._id])
						// this.poliza.pago = this.pago._id;
						//Mostrar el Form del Tomador
					}
  			},
  			error=>{
  				console.log(error);
  			}
  		)
  }


	buscarPlaca(){
	  	if(this.poliza.placa == ""){
	  		this.mensaje = "";
	  		this.setearFechas();
	  		this.poliza = new Poliza('','','',null,this.inicio,this.fin,null,null,null,null,null,this.user._id,this.pago._id,this._authService.usuarioLogeado.email);
	  		return
	  	}else{
	  		this._polizaService.getPlaca(this.poliza.placa)
	  			.subscribe(result=>{
	  						// console.log(result);
	  						if(result.poliza){
	  							this.poliza = result.poliza;
	  							this.fechaExistPoliza();
	  							this.poliza.fechaInicio = this.inicio;
	  							this.poliza.fechaVen = this.fin;
	  						}
	  					});
	  	}
	  	
	  }


	actualizarUsuario(){
		this._userService.editUser(this.user._id, this.user)
						.subscribe(
							result=>{
								console.log(result);
								this.buscarUsuario();
								if(result.user){
									this.user = result.user;
									console.log()
									//Mostrar el otro form
								}
							},
							error=>{
								console.log(error);
							}
						);
		this.visibleTomador = false;
		this.visiblePago = true;
	}

	buscarUsuario(){
		this._userService.getUser(this.user._id)
					.subscribe(
							result=>{
								this.user = result.user;
							},
							error=>{
								console.log(error);
							}
						)
	}

	pagar(){
		this._pagoService.addPago(this.pago)
					.subscribe(
							result=>{
								this.pago = result.pago;
								// console.log(this.pago);
								this.poliza.pago = result.pago._id;
								this.agregarPoliza();
								this.enviarCorreo();

								  this.visiblePoliza = true;
								  this.visibleTomador = false;
								  this.visiblePago = false;

							},error=>{
								console.log(error);
							}
						);
		
	}

	enviarCorreo(){
		this._emailService.enviarEmail(this.poliza)
					.subscribe(
						result=>{
							console.log(result);
						},
						error=>{
								console.log(error);
							}

						);
	}

	//VALIDACIONES
	//fecha
	fechaExistPoliza(){
		if(this.poliza.fechaVen){
			let nueva= this.fin.setDate(this.fin.getDate() + 1);
			this.inicio = new Date(nueva);
			let calc = new Date().setFullYear(new Date().getFullYear() + 2);
			let fin = new Date(calc);
			this.fin = fin;
		}

	}

	setearFechas(){
		this.inicio = new Date();
 		this.calc = new Date().setFullYear(new Date().getFullYear() + 1);
 		this.fin = new Date(this.calc)
	}

	sumarDias(fecha, dias){
	  fecha.setDate(fecha.getDate() + dias);
	  return fecha;
	}

  validarFechaTdc(){
  	let hoy = new Date();
  	let hoyComp = hoy.getTime();
  	let fe = this.pago.fechaVen;
	let dt = new Date(fe);
	let defi= this.sumarDias(dt,1);
	let listo = defi.getTime();
  	// let feTime= fe.getTime();

  	if(this.pago.fechaVen){
	  		if(listo <= hoyComp ){
	  		console.log("La fecha vencimiento no puede mayor o igual a hoy")
	  		return true;
	  	}
  	}
  	
  	return false;
  }

	
	evaluarClase(event:any){
		if(event.target.value == "MOTOS"){
			this.claseCapturada = "MOTOS";
		}

		if(event.target.value == "CAMPEROS Y CAMIONETAS"){
			this.claseCapturada = "CAMPEROS Y CAMIONETAS";
		}

		if(event.target.value == "CARGA O MIXTO"){
			this.claseCapturada = "CARGA O MIXTO";
		}

		if(event.target.value == "OFICIALES ESPECIALES"){
			this.claseCapturada = "OFICIALES ESPECIALES";
		}

		if(event.target.value == "AUTOS FAMILIARES"){
			this.claseCapturada = "AUTOS FAMILIARES";
		}

		if(event.target.value == "VEHICULOS PARA SEIS O MAS PASAJEROS"){
			this.claseCapturada = "VEHICULOS PARA SEIS O MAS PASAJEROS";
		}

		if(event.target.value == "AUTOS DE NEGOCIOS Y TAXIS"){
			this.claseCapturada = "AUTOS DE NEGOCIOS Y TAXIS";
		}

		if(event.target.value == "BUSES Y BUSETAS DE SERVICIO PUBLICO URBANO"){
			this.poliza.tasa = 21.81;
			this.poliza.valorPrima = 536300;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
		}

		if(event.target.value == "SERVICIO PUBLICO INTERMUNICIPAL"){
			this.claseCapturada = "SERVICIO PUBLICO INTERMUNICIPAL";
		}

		if(event.target.value == ""){
			this.poliza.tasa = null;
			this.poliza.valorPrima = null;
			this.poliza.fosyga = null;
			this.poliza.subtotal = null;
			this.poliza.total = null;
		}
	}

	//Dos Variables
	evaluarSubtipo(event:any){
		//MOTOS
		if(this.claseCapturada == "MOTOS" && this.between(event.target.value, 0, 100)){
			this.poliza.tasa = 8.26;
			this.poliza.valorPrima = 203100;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
		}

		if(this.claseCapturada == "MOTOS" && this.between(event.target.value, 101, 200)){
			// console.log('SuBTIPO')
			this.poliza.tasa = 11.09;
			this.poliza.valorPrima = 272700;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
		}


		if(this.claseCapturada == "MOTOS" && this.between(event.target.value, 201, 5000)){
			// console.log('SuBTIPO')
			this.poliza.tasa = 12.51;
			this.poliza.valorPrima = 307600;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
		}

		//CAMPEROS Y CAMIONETAS
		if(this.claseCapturada == 'CAMPEROS Y CAMIONETAS'){
			this.subtipoCapturado = event.target.value;
		}

		// CARGA O MIXTO
		if(this.claseCapturada == "CARGA O MIXTO" && this.between(event.target.value, 0, 4.99)){
			this.poliza.tasa = 14.90;
			this.poliza.valorPrima = 366300;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
		}

		if(this.claseCapturada == "CARGA O MIXTO" && this.between(event.target.value, 5, 15)){
			this.poliza.tasa = 21.53;
			this.poliza.valorPrima = 529400;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
		}

		if(this.claseCapturada == "CARGA O MIXTO" && this.between(event.target.value, 16, 999999)){
			this.poliza.tasa = 27.23;
			this.poliza.valorPrima = 669600;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
		}

		// OFICIALES ESPECIALES
		if(this.claseCapturada == "OFICIALES ESPECIALES" && this.between(event.target.value, 0, 1499)){
			this.poliza.tasa = 16.70;
			this.poliza.valorPrima = 412300;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
		}

		if(this.claseCapturada == "OFICIALES ESPECIALES" && this.between(event.target.value, 1500, 2500)){
			this.poliza.tasa = 21.15;
			this.poliza.valorPrima = 520000;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
		}

		if(this.claseCapturada == "OFICIALES ESPECIALES" && this.between(event.target.value, 2501, 999999)){
			this.poliza.tasa = 25.36;
			this.poliza.valorPrima = 623600;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
		}

		//AUTOS FAMILIARES
		if(this.claseCapturada == 'AUTOS FAMILIARES'){
			this.subtipoCapturado = event.target.value;
		}

		//VEHICULOS PARA SEIS O MAS PASAJEROS
		if(this.claseCapturada == 'VEHICULOS PARA SEIS O MAS PASAJEROS'){
			this.subtipoCapturado = event.target.value;
		}

		//AUTOS DE NEGOCIOS Y TAXIS
		if(this.claseCapturada == 'AUTOS DE NEGOCIOS Y TAXIS'){
			this.subtipoCapturado = event.target.value;
		}

		// SERVICIO PUBLICO INTERMUNICIPAL
		if(this.claseCapturada == "SERVICIO PUBLICO INTERMUNICIPAL" && this.between(event.target.value, 0, 9)){
			this.poliza.tasa = 22.01;
			this.poliza.valorPrima = 541200;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
		}

		if(this.claseCapturada == "SERVICIO PUBLICO INTERMUNICIPAL" && this.between(event.target.value, 10, 999999)){
			this.poliza.tasa = 31.96;
			this.poliza.valorPrima = 785900;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
		}

	}

	//Tres Variables
	evaluarEdad(event:any){
		//CAMPEROS Y CAMIONETAS
		if(this.claseCapturada == "CAMPEROS Y CAMIONETAS" && this.between(this.subtipoCapturado, 0, 1499) && this.between(event.target.value, 0, 9)){
			this.poliza.tasa = 13.29;
			this.poliza.valorPrima = 326800;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
			// console.log('Entre')
		}

		if(this.claseCapturada == "CAMPEROS Y CAMIONETAS" && this.between(this.subtipoCapturado, 0, 1499) && this.between(event.target.value, 10, 999999)){
			this.poliza.tasa = 15.99;
			this.poliza.valorPrima = 393200;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
			// console.log('Entre')
		}

		if(this.claseCapturada == "CAMPEROS Y CAMIONETAS" && this.between(this.subtipoCapturado, 1500, 2500) && this.between(event.target.value, 0, 9)){
			this.poliza.tasa = 15.88;
			this.poliza.valorPrima = 390400;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
			// console.log('Entre')
		}

		if(this.claseCapturada == "CAMPEROS Y CAMIONETAS" && this.between(this.subtipoCapturado, 1500, 2500) && this.between(event.target.value, 10, 999999)){
			this.poliza.tasa = 18.82;
			this.poliza.valorPrima = 462700;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
			// console.log('Entre')
		}

		if(this.claseCapturada == "CAMPEROS Y CAMIONETAS" && this.between(this.subtipoCapturado, 2501, 999999) && this.between(event.target.value, 0, 9)){
			this.poliza.tasa = 18.63;
			this.poliza.valorPrima = 458100;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
			// console.log('Entre')
		}

		if(this.claseCapturada == "CAMPEROS Y CAMIONETAS" && this.between(this.subtipoCapturado, 2501, 999999) && this.between(event.target.value, 10, 999999)){
			this.poliza.tasa = 21.39;
			this.poliza.valorPrima = 525900;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
			// console.log('Entre')
		}

		// AUTOS FAMILIARES

		if(this.claseCapturada == "AUTOS FAMILIARES" && this.between(this.subtipoCapturado, 0, 1499) && this.between(event.target.value, 0, 9)){
			this.poliza.tasa = 7.48;
			this.poliza.valorPrima = 183900;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;			
		}

		if(this.claseCapturada == "AUTOS FAMILIARES" && this.between(this.subtipoCapturado, 0, 1499) && this.between(event.target.value, 10, 999999)){
			this.poliza.tasa = 9.93;
			this.poliza.valorPrima = 244100;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
			// console.log('Entre')
		}

		if(this.claseCapturada == "AUTOS FAMILIARES" && this.between(this.subtipoCapturado, 1500, 2500) && this.between(event.target.value, 0, 9)){
			this.poliza.tasa = 9.12;
			this.poliza.valorPrima = 224200;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;			
		}

		if(this.claseCapturada == "AUTOS FAMILIARES" && this.between(this.subtipoCapturado, 1500, 2500) && this.between(event.target.value, 10, 999999)){
			this.poliza.tasa = 11.35;
			this.poliza.valorPrima = 279100;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;			
		}

		if(this.claseCapturada == "AUTOS FAMILIARES" && this.between(this.subtipoCapturado, 2500, 999999) && this.between(event.target.value, 0, 9)){
			this.poliza.tasa = 10.66;
			this.poliza.valorPrima = 262100;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;			
		}

		if(this.claseCapturada == "AUTOS FAMILIARES" && this.between(this.subtipoCapturado, 2500, 999999) && this.between(event.target.value, 10, 999999)){
			this.poliza.tasa = 12.65;
			this.poliza.valorPrima = 311000;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;			
		}

		// VEHICULOS PARA SEIS O MAS PASAJEROS

		if(this.claseCapturada == "VEHICULOS PARA SEIS O MAS PASAJEROS" && this.between(this.subtipoCapturado, 0, 2499) && this.between(event.target.value, 0, 9)){
			this.poliza.tasa = 13.37;
			this.poliza.valorPrima = 328700;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;			
		}


		if(this.claseCapturada == "VEHICULOS PARA SEIS O MAS PASAJEROS" && this.between(this.subtipoCapturado, 0, 2499) && this.between(event.target.value, 10, 999999)){
			this.poliza.tasa = 17.08;
			this.poliza.valorPrima = 420000;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;			
		}

		if(this.claseCapturada == "VEHICULOS PARA SEIS O MAS PASAJEROS" && this.between(this.subtipoCapturado, 2500, 999999) && this.between(event.target.value, 0, 9)){
			this.poliza.tasa = 17.91;
			this.poliza.valorPrima = 440400;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;			
		}

		if(this.claseCapturada == "VEHICULOS PARA SEIS O MAS PASAJEROS" && this.between(this.subtipoCapturado, 2500, 999999) && this.between(event.target.value, 10, 999999)){
			this.poliza.tasa = 21.51;
			this.poliza.valorPrima = 528900;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;			
		}



		//AUTOS DE NEGOCIOS Y TAXIS
		if(this.claseCapturada == "AUTOS DE NEGOCIOS Y TAXIS" && this.between(this.subtipoCapturado, 0, 1499) && this.between(event.target.value, 0, 9)){
			this.poliza.tasa = 9.28;
			this.poliza.valorPrima = 228200;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
			// console.log('Entre')
		}

		if(this.claseCapturada == "AUTOS DE NEGOCIOS Y TAXIS" && this.between(this.subtipoCapturado, 0, 1499) && this.between(event.target.value, 10, 999999)){
			this.poliza.tasa = 11.60;
			this.poliza.valorPrima = 285200;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
			// console.log('Entre')
		}

		if(this.claseCapturada == "AUTOS DE NEGOCIOS Y TAXIS" && this.between(this.subtipoCapturado, 1500, 2500) && this.between(event.target.value, 0, 9)){
			this.poliza.tasa = 11.54;
			this.poliza.valorPrima = 283700;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
			// console.log('Entre')
		}

		if(this.claseCapturada == "AUTOS DE NEGOCIOS Y TAXIS" && this.between(this.subtipoCapturado, 1500, 2500) && this.between(event.target.value, 10, 999999)){
			this.poliza.tasa = 14.27;
			this.poliza.valorPrima = 350900;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
			// console.log('Entre')
		}

		if(this.claseCapturada == "AUTOS DE NEGOCIOS Y TAXIS" && this.between(this.subtipoCapturado, 2501, 999999) && this.between(event.target.value, 0, 9)){
			this.poliza.tasa = 14.90;
			this.poliza.valorPrima = 366300;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
			// console.log('Entre')
		}

		if(this.claseCapturada == "AUTOS DE NEGOCIOS Y TAXIS" && this.between(this.subtipoCapturado, 2501, 999999) && this.between(event.target.value, 10, 999999)){
			this.poliza.tasa = 17.49;
			this.poliza.valorPrima = 430000;
			this.poliza.fosyga = this.poliza.valorPrima / 2;
			this.poliza.subtotal = this.poliza.valorPrima + this.poliza.fosyga;
			this.poliza.total = this.poliza.subtotal + 1610;
			// console.log('Entre')
		}

	}


	// Rango
	between(x, min, max) {
  		return x >= min && x <= max;
	}


}
