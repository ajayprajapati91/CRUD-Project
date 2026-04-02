import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class StorageServices {

  setItem(key:any,item:any){
    localStorage.setItem(key,item)
  }

  removeItem(key:any){
    localStorage.removeItem(key)
  }

  getItem(key:any){
    return localStorage.getItem(key)
  }

  removeAllItem(){
    localStorage.clear();
  }

  getUserRole(): string | null {
  const token = this.getItem('authToken');
  if (!token) return null;

  const decoded: any = jwtDecode(token);
  return decoded.role;
}
  
}
