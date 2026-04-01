export interface CrudUser {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  city: string;
  password: string;
  createdAt: string; 
}

export interface CrudUserPublic {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  city: string;
}

