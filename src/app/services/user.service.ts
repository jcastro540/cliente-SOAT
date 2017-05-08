import { Injectable } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {RequestOptions, Request, RequestMethod} from '@angular/http';

import {GLOBAL} from './global';
import {User} from '../models/user.model';
import { AuthService } from '../services/auth.service';


@Injectable()
export class UserService {
	public url;
	private authorization: string = '';


  constructor(public http: Http,public _authService:AuthService) {
  		this.url = GLOBAL.url;
		this.authorization = this._authService.getToken();
  }


  addUser(user:User){
	let json = JSON.stringify(user);
	let params = json;
	let headers = new Headers({'Content-Type':'application/json'});
	let options = new RequestOptions({ headers: headers });

	return this.http.post(this.url+'/create-user', params, options).
							map(res => res.json());
	}

	getUser(id:string){
		let headers = new Headers({ 'Authorization': this.authorization });
        let options = new RequestOptions({ headers: headers });


		return this.http.get(this.url+'/user/'+id, options)
							.map(res=> res.json());
	}
	editUser(id:string, user:User){
		let json = JSON.stringify(user);
		let params = json;
		let headers = new Headers({'Content-Type':'application/json', 'Authorization': this.authorization});
		let options = new RequestOptions({ headers: headers });

		return this.http.put(this.url+'/user/'+id, params, options)
							.map(res=> res.json());
	}

}
