import { Injectable } from '@angular/core';

import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class GuardAdminService implements CanActivate{

  constructor(
  	private router:Router,
  	private auth:AuthService
  ) { }

 canActivate(){
  	if(this.auth.estaAutenticado() && this.auth.esAdmin()){
  		// console.log("Es el administrador");
  		return true;
  	}else{
  		// console.error("No es admin");
  		this.router.navigate(['/home']);
  		return false;
  	}
  }

}
