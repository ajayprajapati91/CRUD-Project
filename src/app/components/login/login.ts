import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserCrudService } from '../../services/user-crud.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit{
  email = '';
  password = '';
  errorMessage = '';
  submitting = false;
  myForm: any = []
  private myService= inject(UserCrudService)
  private cd = inject(ChangeDetectorRef)
  get formControl() {
    return this.myForm.controls;
  }
 
  ngOnInit(): void {
 
  }

  constructor(
    
    private readonly auth: AuthService,
    private readonly router: Router,
    
  ) { this.myForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

//   onSubmit(): void {
//    if (this.myForm.invalid) return;
//   this.submitting = true;
//   this.errorMessage = '';

//   this.auth.login(this.email, this.password).subscribe({
//     next: (res) => {
//        // Save logged-in user in localStorage
//     localStorage.setItem('currentUser', JSON.stringify({
//       fullName: res.fullName,
//       email: res.email
//     }));

//       console.log('SUCCESS RESPONSE:', res);
//       this.submitting = false;

//       // navigate to dashboard only if backend response is valid
//       if (res?.email) {
//         this.router.navigate(['/dashboard']);
//       }
//     },
//     error: (err) => {
//       console.log('ERROR RESPONSE:', err);
//       this.submitting = false;
//       this.errorMessage = 'Invalid email or password.';
//     },
//   });
// }

onSubmit() {
    if (this.myForm.invalid) return;
    this.myService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        if (res && res.token) {
          localStorage.setItem('token', res.token)
          const successMessage = document.getElementById('successMessage');
          if (successMessage) successMessage.classList.add('show');
 
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        }
        else {
          alert('login failed: Invalid credentials')
        }
        // this.myForm=res
        console.log("Login data", res);
        this.cd.detectChanges()
      },
      error: (err) => {
        console.error(err);
        alert('Login failed: Server error or invalid credentials');
      }
    });
  }
}

