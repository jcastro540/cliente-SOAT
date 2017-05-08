import { Component, OnInit } from '@angular/core';
import { PolizaService } from '../../services/poliza.service';
import { Poliza } from '../../models/poliza';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styles: []
})
export class AdminComponent implements OnInit {
 
  public polizas:Poliza[];


  constructor( public _polizaService:PolizaService ) {

  }

  ngOnInit() {
  	this._polizaService.getPolizas()
  		.subscribe(
  			result=>{
  				this.polizas = result.polizas;
  				console.log(this.polizas);
  			},error=>{
  				console.log(error);
  			}
  		);

  }

}
