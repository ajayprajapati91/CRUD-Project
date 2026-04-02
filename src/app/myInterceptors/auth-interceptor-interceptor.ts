import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageServices } from '../services/storage.services';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  console.log("From interceptor")
  
  const skippedUrls=[
    '/login',
    '/register'
  ]
  const myStorage= inject(StorageServices)

  const isSkippedUrl=skippedUrls.some(url=>req.url.includes(url))
  if(isSkippedUrl){
    return next(req);
  }

  const myAuthToken= myStorage.getItem('authToken')
  if(myAuthToken){
  const myCloneReq=req.clone({
    setHeaders:{
      Authorization:myAuthToken
    }
  })
  return next(myCloneReq);
  }
  

  return next(req);
};
