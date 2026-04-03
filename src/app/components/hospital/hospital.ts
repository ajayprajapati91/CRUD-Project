import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageServices } from '../../services/storage.services';
@Component({
  selector: 'app-hospital',
  standalone: false,
  templateUrl: './hospital.html',
  styleUrl: './hospital.css',
})
export class Hospital {
  myRoute = inject(Router)
   myStorage=inject(StorageServices)

 logout(): void {
    this.myStorage.removeItem('authToken')
    alert("You have successfully logout")
    this.myRoute.navigate(['/login'])
    // this.auth.logout();
  }
}
