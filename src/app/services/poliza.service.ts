import { Injectable } from '@angular/core';
import { Http, Headers,RequestOptions, Request, RequestMethod } from '@angular/http';
import  'rxjs/Rx';

import { Poliza } from '../models/poliza';
import {GLOBAL} from './global';
import { AuthService } from '../services/auth.service';

@Injectable()
export class PolizaService {
  public placa:Poliza;
  public url;
  private authorization: string = '';

  public poliza:Poliza;




  constructor(public http:Http, public _authService:AuthService) {
  	this.url = GLOBAL.url;
  	this.authorization = this._authService.getToken();
  }

  getPlaca(placa:string){

		let headers = new Headers({ 'Authorization': this.authorization });
        let options = new RequestOptions({ headers: headers });

		return this.http.get(`${this.url}/placa/${placa}`,options)
		.map(res=> {
			this.placa = res.json();
			return res.json();
			// console.log(res.json());
		})
	}
  

  	addPoliza(poliza:Poliza){
		let json = JSON.stringify(poliza);
		let params = json;
		let headers = new Headers({'Content-Type':'application/json', 'Authorization': this.authorization});
		let options = new RequestOptions({ headers: headers });

		return this.http.post(this.url+'/create-poliza', params,options).
								map(res => res.json());
	}


	editPoliza(id:string, poliza:Poliza){
		let json = JSON.stringify(poliza);
		let params = json;
		let headers = new Headers({'Content-Type':'application/json', 'Authorization': this.authorization});
		let options = new RequestOptions({ headers: headers });

		return this.http.put(this.url+'/poliza/'+id, params, options)
							.map(res=> res.json());
	}


	getPolizas(){
		let headers = new Headers({ 'Authorization': this.authorization });
        let options = new RequestOptions({ headers: headers });

		return this.http.get(this.url+'/polizas', options)
							.map(res=> res.json());
	}
	

	getPoliza(id:string){
		let headers = new Headers({ 'Authorization': this.authorization });
        let options = new RequestOptions({ headers: headers });

		return this.http.get(this.url+'/poliza/'+id, options)
							.map(res=> res.json());
	}


	deletePoliza(id:string){
		let headers = new Headers({'Content-Type':'application/json', 'Authorization': this.authorization});
		let options = new RequestOptions({ headers: headers });
		return this.http.delete(this.url+'/poliza/'+id, options)
							.map(res=> res.json());
	}

}
