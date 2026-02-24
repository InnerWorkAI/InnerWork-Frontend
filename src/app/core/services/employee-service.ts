import { Injectable, inject } from '@angular/core';
import { ApiService } from './api-service'
import { Employee } from '../../shared/models/employee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  // Inyectamos el ApiService pro de tu compañero
  private api = inject(ApiService);
  
  // Ruta que sacamos del Swagger (ojo a la barra final si falla)
  private readonly endpoint = 'employees/';

  // GET: Para rellenar tu tabla del Dashboard
  getEmployees(): Observable<Employee[]> {
    const token = localStorage.getItem('token');
    return this.api.get<Employee[]>(this.endpoint);
  }

  // POST: Para mandar la chicha del modal (Crear)
  createEmployee(employee: Employee): Observable<Employee> {
    return this.api.post<Employee>(this.endpoint, employee);
  }

  // PUT: Para cuando edites un empleado existente
  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.api.put<Employee>(`${this.endpoint}${id}/`, employee);
  }

  // DELETE: Por si quieres añadir el botón de borrar en la tabla
  deleteEmployee(id: number): Observable<any> {
    return this.api.delete(`${this.endpoint}${id}/`);
  }
}