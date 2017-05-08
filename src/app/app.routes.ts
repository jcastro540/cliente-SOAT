import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/user/login.component';
import { HomeComponent } from './components/home/home.component';
import { PolizaComponent } from './components/poliza/poliza.component';
import { PolizaDetailComponent } from './components/poliza/poliza-detail.component';
import { AdminComponent } from './components/admin/admin.component';

//Proteger Rutas
import { GuardService } from './services/guard.service';
import { GuardAdminService } from './services/guard-admin.service';


const APP_ROUTES: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'home',
	  canActivate:[GuardService],
	  component: HomeComponent
	 },
	 { path: 'poliza-add',
	  canActivate:[GuardService],
	  component: PolizaComponent
	
	 },
	 { path: 'poliza-detail/:id',
	  canActivate:[GuardService],
	  component: PolizaDetailComponent
	
	 },
	  { path: 'admin',
	  canActivate:[GuardAdminService],
	  component: AdminComponent
	 },
	{ path: '**', pathMatch:'full', redirectTo:'home' }
];


export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);