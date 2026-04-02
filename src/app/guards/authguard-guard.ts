import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageServices } from '../services/storage.services';

export const authguardGuard: CanActivateFn = (route, state) => {
  const myStorage=inject(StorageServices)
  const myRouter = inject(Router)
  const token= myStorage.getItem('authToken')

  if(token){
    return true
  }

  myRouter.navigate(['/login'])
  return false

//     const requiredRole=route.data?.['role'];
//   const userRole = myStorage.getUserRole();

//  if (requiredRole && userRole !== requiredRole) {
//     myRouter.navigate(['/unauthorized']); // create this page
//     return false;
//   }

//  return true;
};
