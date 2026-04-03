import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageServices } from './storage.services';
import { FormBuilder } from '@angular/forms';
import { Router } from 'express';

export interface CreateUserDto {
  fullName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  city: string;
  password: string;
  role:string;
}

export interface UpdateUserDto {
  fullName?: string;
  email?: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other';
  city?: string;
  password?: string;
  role?:string;
}

@Injectable({
  providedIn: 'root',
})
export class UserCrudService {
  private baseUrl = 'http://localhost:5050/v1/auth';

  myStorageService=inject(StorageServices)


  constructor(private http: HttpClient) {}

  register(dto: CreateUserDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, dto, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  } 

  login(credentials:any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // login(email: string, password: string): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/login`, { email, password });
  // }

  isLoggedIn(){
    let token= this.myStorageService.getItem('authToken')
    if(token) 
      return true
    return false
  }

  forgetPassword(data: { email: string; password: string }) {
  return this.http.post(`${this.baseUrl}/forget`, data, {
    responseType: 'text'
  });
}

  // getDashboardData(){
  //   return this.http.get(this.baseUrl+'/dashboard')
  // }

   // login(credentials:any):Observable<any>{
  //   return this.http.post(`${this.baseUrl}/login`,credentials);
  // }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateById(id: number, dto: UpdateUserDto): Observable<any> {
  const payload = { ...dto };
  if (!payload.password) delete payload.password;

  return this.http.put(`${this.baseUrl}/${id}`, payload);
}

  deleteById(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  deleteAll(): Observable<any[]> {
    return this.http.delete<any[]>(`${this.baseUrl}/delete-all`);
  }

  downloadReport() {
  return this.http.get(`${this.baseUrl}/reports`, {
    responseType: 'blob' // VERY IMPORTANT
  });
}
}