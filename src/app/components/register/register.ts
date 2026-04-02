import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserCrudService } from '../../services/user-crud.service';
import { FormControl,FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {

  public myForm:any

  constructor(
    private readonly userCrud: UserCrudService,
    private readonly router: Router
  ){
    this.myForm=new FormGroup({
    fullName:new FormControl('',Validators.required),
    email:new FormControl('',Validators.required),
    phone:new FormControl('',Validators.required),
    gender:new FormControl('',Validators.required),
    city:new FormControl('',Validators.required),
    role:new FormControl('',Validators.required),
    password:new FormControl('',Validators.required),
    confirmPassword:new FormControl('',Validators.required)
    });
  };

  get formControl(){
    return this.myForm.controls;
  }

  fullName = '';
  email = '';
  phone = '';
  gender: 'Male' | 'Female' | 'Other' | '' = '';
  city = '';
  password = '';
  confirmPassword = '';
  cityOptions: string[] = ['Delhi', 'Mumbai', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata'];
  role='';
  roleOptions:string[] =['ADMIN','DONOR','HOSPITAL','DONATION'];

  errorMessage = '';
  successMessage = '';
  submitting = false;


  

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  onSubmit(): void {
  console.log(this.myForm.value);
  console.log(this.myForm.valid);
  
  this.errorMessage = '';
  this.successMessage = '';

  // Read directly from the form
  const gender = this.myForm.get('gender')?.value;
  const city = this.myForm.get('city')?.value;
  const role = this.myForm.get('role')?.value;
  const password = this.myForm.get('password')?.value;
  const confirmPassword = this.myForm.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    this.errorMessage = 'Passwords do not match.';
    return;
  }

  if (!gender || !city) {
    this.errorMessage = 'Please select gender and city.';
    return;
  }

  this.submitting = true;
  this.userCrud
    .register({
      fullName: this.myForm.get('fullName')?.value.trim(),
      email: this.myForm.get('email')?.value.trim(),
      phone: this.myForm.get('phone')?.value.trim(),
      gender: gender,
      city: city,
      role:role,
      password: password,
    })
    .subscribe({
      next: (user) => { 
        //
        // Save user info in localStorage
    localStorage.setItem('currentUser', JSON.stringify({
      fullName: user.fullName,
      email: user.email
    }));
    //
        this.submitting = false;
        this.successMessage = 'Registration successful. Please login.';
        this.router.navigate(['/login']);
        console.log("registerd")
      },
      error: (err: unknown) => {
        this.submitting = false;
        this.errorMessage =
          err instanceof Error ? err.message : 'Registration failed.';
      },
    });
}
}
