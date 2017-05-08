import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LOCALE_ID } from '@angular/core';


import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/user/login.component';
import { HomeComponent } from './components/home/home.component';
import { PolizaComponent } from './components/poliza/poliza.component';
import { PolizaDetailComponent } from './components/poliza/poliza-detail.component';
import { AdminComponent } from './components/admin/admin.component';


// SERVICES
import { AuthService } from './services/auth.service';
import { GuardService } from './services/guard.service';
import { GuardAdminService } from './services/guard-admin.service';
import { UserService } from './services/user.service';
import { PolizaService } from './services/poliza.service';
import { PagoService } from './services/pago.service';
import { EmailService } from './services/email.service';

// RUTAS
import { APP_ROUTING } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    HomeComponent,
    PolizaComponent,
    PolizaDetailComponent,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    APP_ROUTING
  ],
  providers: [AuthService,GuardService,GuardAdminService,UserService,PolizaService,PagoService, EmailService,{provide: LOCALE_ID, useValue: "es"}],
  bootstrap: [AppComponent]
})
export class AppModule { }
