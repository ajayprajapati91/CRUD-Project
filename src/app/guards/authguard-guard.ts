import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageServices } from '../services/storage.services';

export const authguardGuard: CanActivateFn = (route, state) => {
  const myStorage=inject(StorageServices)
  const myRouter = inject(Router)
  const token= myStorage.getItem('authToken')
  const role = myStorage.getUserRole();
  const expectedRole = route.data?.['role'];

  if(token){
    return true
  }

  myRouter.navigate(['/login'])
  return false

if(role!==expectedRole)
  {
     myRouter.navigate(['/unauthorized'])
    return false;
  }
  return true;
 
};
