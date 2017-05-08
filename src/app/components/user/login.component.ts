import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import {User} from '../../models/user.model'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  
  public title: string;
  public user;
  public userAdd;
  public errorMessage: string;
  public token;
  public identity;
  public message;
  public messageRegistro:string="";
  public password2:string = "";
  public iguales:boolean;

  constructor( 
  			public _authService:AuthService,
        public _userService:UserService,
  			public router:Router,
  			public activatedRoute:ActivatedRoute
  	) { }

  ngOnInit() {
  	this.user = {
  		email: "",
  		password: ""
  	};
    this.userAdd = {
      email: "",
      password: ""
    };
  }


  onSubmit(){
  	//console.log(JSON.stringify(this.user));
  	this._authService.signup(this.user).subscribe(
  		response =>{
  			
    		let token = response.token;
        let identity = response.identity;
    		this.token = token;
        this.identity = identity;


  		if(this.token != undefined) {
  			localStorage.setItem('token', this.token);
          	localStorage.setItem('identity', JSON.stringify(this.identity));
          	// window.location.href='/dashboard';
          	return this.router.navigate(['/home']);
          //console.log(this.identity);
  			}

  			if(response.message) {
  				this.message = response.message;
  				//console.log(this.message);
  			}else{
  				this.message = "";
  				//console.log(this.message);
  			}
  		},
  		error =>{
  			this.errorMessage = <any>error;
  			if(this.errorMessage !=null) {
  				console.log(this.errorMessage);
  			}
  		}

  	);
  }


    public addUser(){
    //console.log(this.user);

    this._userService.addUser(this.user).subscribe(
      response=>{
        if(response.message) {
          this.messageRegistro = response.message;
        }else{
          this.user = response.identity;
          this.messageRegistro = "Usuario Creado satisfactoriamente, por favor inicie sesión";
          this.user.password = "";
        }
      },
      error => {
        this.errorMessage = <any>error;

        if(this.errorMessage != null) {
          console.log(this.errorMessage);
          alert('Error en la petición')
        }
      }

    );

  }


  sonIguales(){
    let pass1 = this.user.password;
    let pass2 = this.password2;

    if(pass1 == pass2) {
      this.iguales= true;
      // console.log(this.iguales)
      return false;
    }else{
      // console.log('no son iguales')
      this.iguales= false;
      // console.log(this.iguales)
      return true;
    }
  }





}
