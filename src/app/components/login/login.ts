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
  if (this.myForm.invalid) return;

  const user = {
    email: this.myForm.value.email,
    password: this.myForm.value.password,
  };

  this.myApiService.login(user).subscribe({
    next: (res: any) => {
      if (res && res.token) {
        // Store token
        this.myLocalStorage.setItem('authToken', 'Bearer ' + res.token);

        // Decode JWT to get role
        let payload;
        try {
          payload = JSON.parse(atob(res.token.split('.')[1]));
        } catch (e) {
          console.error('Failed to decode token', e);
          alert('Login failed: Invalid token');
          return;
        }

        // Get the first role from roles array
        const role = payload.roles && payload.roles.length > 0 
          ? payload.roles[0].replace('ROLE_', '').toUpperCase() 
          : 'UNKNOWN';

        this.myLocalStorage.setItem('userRole', role);
        console.log('Logged in as role:', role);

          // Get expiration
        const expUnix = payload.exp; // exp is usually in seconds
        const expDate = new Date(expUnix * 1000); // convert to milliseconds
        console.log('Token expires at:', expDate.toLocaleString());


        // Redirect based on role
        switch (role) {
          case 'ADMIN':
            this.router.navigate(['/dashboard']);
            break;
          case 'DONOR':
            this.router.navigate(['/donor']);
            break;
          case 'HOSPITAL':
            this.router.navigate(['/hospital']);
            break;
          default:
            this.router.navigate(['/home']);
        }
      } else {
        alert('Login failed: Invalid response from server');
      }
    },
    error: (err) => {
      console.error(err);
      alert('Login failed: Server error or invalid credentials');
    },
  });
}


// onSubmit() {
//   // if (this.myForm.invalid) return;
//   // const { email, password } = this.myForm.value;

//   this.myApiService.login(this.myForm.value).subscribe({
//   next: (res: any) => {
//     if (res && res.token && res.role) {
//       // Store token and role
//       this.myLocalStorage.setItem('authToken', 'Bearer ' + res.token);
//       this.myLocalStorage.setItem('userRole', res.role);

//       // Redirect based on role
//       const role = res.role?.toUpperCase();
//       switch(res.role) {
//         case 'ADMIN':
//           this.router.navigate(['/dashboard']);
//           break;
//         case 'HOSPITAL':
//           this.router.navigate(['/hospital']);
//           break;
//         case 'DONOR':
//           this.router.navigate(['/donor']);
//           break;
//         default:
//           this.router.navigate(['/home']);
//       }
//     } else {
//       alert('Login failed: Invalid response from server');
//     }
//   },
//   error: (err) => {
//     console.error(err);
//     alert('Login failed');
//   }
// });
// }
showForgotModal = false;

forgotData = {
  email: '',
  password: ''
};
openForgotModal() {
  this.showForgotModal = true;
  console.log("Forgot modal opened");
}

closeForgotModal() {
  this.showForgotModal = false;
}

submitForgotPassword() {
  console.log("forgot")
  if (!this.forgotData.email || !this.forgotData.password) {
    alert("Please fill all fields");
    return;
  }

  this.myApiService.forgetPassword(this.forgotData).subscribe({
    next: (res) => {
      alert("Password updated successfully");
      this.closeForgotModal();
    },
    error: (err) => {
      console.error(err);
      alert("Failed to reset password");
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