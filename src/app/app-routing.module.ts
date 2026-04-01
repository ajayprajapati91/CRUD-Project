import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { About } from './components/about/about';
import { Help } from './components/help/help';
import { Home } from './components/home/home';
import { ErrorPage } from './components/error-page/error-page';
import { Profile } from './components/profile/profile';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: About },
  { path: 'help', component: Help },
  {
    path: 'profile/:id',
    component:Profile
  },
   {
    path: 'profile',
    component:Profile
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children:[
      {
        path: 'profile',
        component:Profile
      }
    ]
  },
 
  // { path: 'dashboard', component: DashboardComponent },
  { path: '**', component: ErrorPage},
  
  // { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
