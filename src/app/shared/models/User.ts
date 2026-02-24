export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCompanyCredentials {
  email: string;
  password: string;
  name: string;
  address: string;
}

export interface Address {
  lat: number;
  lng: number;
  address: string;
}