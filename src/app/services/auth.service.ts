import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserCrudService } from './user-crud.service';

const SESSION_EMAIL_KEY = 'crudproject_session_email';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly userCrud: UserCrudService,
    private readonly router: Router
  ) {}


  login(email: string, password: string): Observable<any> {
    return new Observable((observer) => {
      this.userCrud.login(email, password).subscribe({
        next: (res) => {
          if (res && res.email) {
            // save session for AuthGuard
            localStorage.setItem(SESSION_EMAIL_KEY, res.email);
            observer.next(res);
          } else {
            observer.error('Invalid email or password');
          }
          observer.complete();
        },
        error: (err) => observer.error(err),
      });
    });
  }
 
  logout(): void {
    localStorage.removeItem(SESSION_EMAIL_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(SESSION_EMAIL_KEY);
  }

  getLoggedInEmail(): string | null {
    return localStorage.getItem(SESSION_EMAIL_KEY);
  }
}

