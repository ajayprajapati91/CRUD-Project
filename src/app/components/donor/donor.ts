import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageServices } from '../../services/storage.services';

@Component({
  selector: 'app-donor',
  standalone: false,
  templateUrl: './donor.html',
  styleUrl: './donor.css',
})
export class Donor {
   myRoute = inject(Router)
   myStorage=inject(StorageServices)

 logout(): void {
    this.myStorage.removeItem('authToken')
    alert("You have successfully logout")
    this.myRoute.navigate(['/login'])
    // this.auth.logout();
  }
}
