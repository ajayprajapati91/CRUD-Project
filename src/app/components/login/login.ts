import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserCrudService } from '../../services/user-crud.service';
import { HttpClient } from '@angular/common/http';
import { StorageServices } from '../../services/storage.services';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit{

  myHttpClient=inject(HttpClient)
  myLocalStorage= inject(StorageServices)
  myApiService=inject(UserCrudService)
  fb=inject(FormBuilder)
  myRoute=inject(Router)

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
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', Validators.required),
});
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }



onSubmit() {
  // if (this.myForm.invalid) return;
  // const { email, password } = this.myForm.value;

  this.myApiService.login(this.myForm.value).subscribe({
    next: (res: any) => {
      console.log("Login success", res);
      this.myLocalStorage.setItem('authToken',('Bearer '+res.token))
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      console.error(err);
      alert('Login failed');
    }
  });
}
}






// onSubmit() {
//     if (this.myForm.invalid) return;
//     this.auth.login(this.email, this.password).subscribe({
//       next: (res: any) => {
//         if (res && res.token) {
//           localStorage.setItem('token', res.token)
//           const successMessage = document.getElementById('successMessage');
//           if (successMessage) successMessage.classList.add('show');
 
//           setTimeout(() => {
//             this.router.navigate(['/dashboard']);
//           }, 1000);
//         }
//         else {
//           alert('login failed: Invalid credentials')
//         }
//         // this.myForm=res
//         console.log("Login data", res);
//         this.cd.detectChanges()
//       },
//       error: (err) => {
//         console.error(err);
//         alert('Login failed: Server error or invalid credentials');
//       }
//     });
//   }