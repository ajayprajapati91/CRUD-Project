import { Component, OnInit} from '@angular/core';
// import {Auth}
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class AppComponent {
  loggedInEmail: string | null = null;
  isLoggedIn: boolean = false;
  title = 'CRUDProject';
  
   constructor(
      private readonly auth: AuthService,
      private router: Router
    ) {}
  
    ngOnInit(): void {
        this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        this.isLoggedIn = !!user;
        this.loggedInEmail = user?.email || null;
      // this.loggedInEmail = this.auth.getLoggedInEmail();
      // this.isLoggedIn = this.auth.isLoggedIn();

     }
    });
  }

   logout() {
    // Remove user from localStorage or service
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    this.loggedInEmail = null;
    this.router.navigate(['/login']);
  }


}
