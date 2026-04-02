import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserCrudService } from './user-crud.service';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private TOKEN_KEY = 'token';
  constructor(
    private readonly userCrud: UserCrudService,
    private readonly router: Router
  ) {}


  login(credentials:any): Observable<any> {
    return new Observable((observer) => {
      this.userCrud.login(Credential).subscribe({
        next: (res) => {
          if (res && res.email) {
            // save session for AuthGuard
            localStorage.setItem(this.TOKEN_KEY, res.email);
            observer.next(res);
          } else {
            observer.error('Invalid credentials');
          }
          observer.complete();
        },
        error: (err) => observer.error(err),
      });
    });
  }
 
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRole(): string | null {
  const token = this.getToken();
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.role;
}
}

