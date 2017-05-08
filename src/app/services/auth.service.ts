import { Injectable } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

import {GLOBAL} from './global';

@Injectable()
export class AuthService {

	public url: string
	public identity;
	public token;
	public usuarioLogeado:any;
	public errorLogin:string= "";


  	constructor(
  		private http: Http,
  		private activatedRoute: ActivatedRoute,
  		private router: Router,
  		){
		this.url = GLOBAL.url;
	}

	signup(user_to_login){
		let json = JSON.stringify(user_to_login);
		let params = json;
		let headers = new Headers({
			'Content-Type':'application/json'
		});

		return this.http.post(this.url+"/login", params,{headers:headers})
							.map(res => res.json());
	}

	getIdentity(){
		let identity = JSON.parse(localStorage.getItem('identity'));

		if(identity != "undefined") {
			this.identity = identity;
		}else{
			this.identity = null;
		}

		return this.identity;
	}

	getToken(){
		let token = localStorage.getItem('token');

		if(token != undefined) {
			this.token = token;
		}else{
			this.token = null;
		}

		return this.token;
	}

	logout() {
		localStorage.removeItem('identity');
        localStorage.removeItem('token');
        this.identity = null;
        this.token = null;

	    return this.router.navigate(['/login']);
	     
    }

  estaAutenticado(){
  	if(localStorage.getItem('identity')){
  		this.usuarioLogeado = JSON.parse(localStorage.getItem('identity'));
  		// console.log(this.usuarioLogeado);
  		return true;
  	}else{
  		return false;
  	}
  }

 
  esAdmin(){
    if(localStorage.getItem('identity')){
	      if(this.usuarioLogeado.role == "admin"){
	        return true;
	      }else{
	        return false;
	      }

   	 }


	}
}
