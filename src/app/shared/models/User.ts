export interface User {
  email: string;
  name: string;
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