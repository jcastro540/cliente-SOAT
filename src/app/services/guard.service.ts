import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';



@Injectable()
export class GuardService implements CanActivate{
  
  constructor(
  		private router:Router,
  		private auth:AuthService
  	) { }

  canActivate(){
  	if(this.auth.estaAutenticado()){
  		// console.log("El guard paso");
  		return true;
  	}else{
  		// console.error("Bloqueado por el guard");
  		this.router.navigate(['/login']);
  		return false;
  	}
  }


}
