import { Component, OnInit } from '@angular/core';
import { Poliza } from '../../models/poliza';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PolizaService } from '../../services/poliza.service';

import * as jsPDF from 'jspdf';



declare var $:any;

@Component({
  selector: 'app-poliza-detail',
  templateUrl: './poliza-detail.component.html',
  styles: []
})
export class PolizaDetailComponent implements OnInit {

	public poliza: Poliza;
	public errorMessage: any;

  constructor(
  		public router:Router,
  		public activatedRoute:ActivatedRoute,
  		public _authService:AuthService,
  		public _polizaService:PolizaService,
  	) { }

  ngOnInit() {
  	// this._polizaService.getPoliza()
  	this.getPoliza();

  }


  getPoliza(){
		this.activatedRoute.params.forEach((params: Params)=>{
			let id = params['id'];

			this._polizaService.getPoliza(id).subscribe(
				result=>{
					this.poliza = result.poliza;
					console.log(this.poliza);

					if(!this.poliza) {
						this.router.navigate(['/home']);
					}
				},
				error=>{
					this.errorMessage = <any>error;
					if(this.errorMessage != null) {
						console.log(this.errorMessage);
						alert('Error en la petición')
					}
				}
			);
		});

	}

	download() {

        var doc = new jsPDF('landscape','pt','legal');
		var specialElementHandlers = {
			'#editor': function(element, renderer){
				return true;
			}
		};


		doc.fromHTML($('#print').html(), 30, 15, {'width': 350,'elementHandlers': specialElementHandlers});
	    // doc.autoPrint();
	    // doc.output("dataurlnewwindow");



        // Save the PDF
        doc.save('poliza.pdf');
    }

}
