export interface User {
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
  address: Address;
}

export interface Address {
  lat: number;
  lng: number;
  address: string;
}