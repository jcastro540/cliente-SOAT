import { Injectable } from '@angular/core';
import { Http, Headers,RequestOptions, Request, RequestMethod } from '@angular/http';
import  'rxjs/Rx';

// import { Pago } from '../models/pago.model';
import {GLOBAL} from './global';
import { AuthService } from '../services/auth.service';
import { Poliza } from'../models/poliza';


@Injectable()
export class EmailService {
  public url;
  private authorization: string = '';

  constructor(public http:Http, public _authService:AuthService) {
  	this.url = GLOBAL.url;
  	this.authorization = this._authService.getToken();
  }


    enviarEmail(poliza:Poliza){
		let json = JSON.stringify(poliza);
		let params = json;
		let headers = new Headers({'Content-Type':'application/json', 'Authorization': this.authorization});
		let options = new RequestOptions({ headers: headers });

		return this.http.post(this.url+'/sendmail', params,options).
								map(res => res.json());
	}

}
