import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ReactiveFormsModule } from '@angular/forms';
import { About } from './components/about/about';
import { Help } from './components/help/help';
import { Home } from './components/home/home';
import { ErrorPage } from './components/error-page/error-page';
import { Profile } from './components/profile/profile';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Authintercepter } from './services/authintercepter';
import { authInterceptorInterceptor } from './myInterceptors/auth-interceptor-interceptor';
// import { jwtDecode } from 'jwt-decode';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    About,
    Help,
    Home,
    ErrorPage,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Profile,
    
  ],
  providers: [provideHttpClient(withInterceptors([authInterceptorInterceptor]))],
  bootstrap: [AppComponent]
})
export class AppModule { }
