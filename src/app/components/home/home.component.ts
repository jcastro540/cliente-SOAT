import { Component, OnInit } from '@angular/core';
import { PolizaService } from '../../services/poliza.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  public placa:string ="";
  public mensaje:string ="";

  constructor( public _polizaService:PolizaService, public _authService:AuthService) { }

  ngOnInit() {
  }


  buscarPlaca(){
  	if(this.placa == ""){
  		this.mensaje = "";
  		return
  	}else{
  		this._polizaService.getPlaca(this.placa).subscribe(
  												poliza=>{
  													// console.log(poliza)
  												})
  	}
  	
  }

}
