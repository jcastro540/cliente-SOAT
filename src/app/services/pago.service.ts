import { Injectable } from '@angular/core';
import { Http, Headers,RequestOptions, Request, RequestMethod } from '@angular/http';
import  'rxjs/Rx';

import { Pago } from '../models/pago.model';
import {GLOBAL} from './global';
import { AuthService } from '../services/auth.service';

@Injectable()

export class PagoService {

  public url;
  private authorization: string = '';

  constructor(public http:Http, public _authService:AuthService) {
  	this.url = GLOBAL.url;
  	this.authorization = this._authService.getToken();
  }



  addPago(pago:Pago){
		let json = JSON.stringify(pago);
		let params = json;
		let headers = new Headers({'Content-Type':'application/json', 'Authorization': this.authorization});
		let options = new RequestOptions({ headers: headers });

		return this.http.post(this.url+'/create-pago', params,options).
								map(res => res.json());
	}

  getPago(id:string){
		let headers = new Headers({ 'Authorization': this.authorization });
        let options = new RequestOptions({ headers: headers });

		return this.http.get(this.url+'/pago/'+id, options)
							.map(res=> res.json());
	}

}
