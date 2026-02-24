import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api-service'
import { Employee } from '../../shared/models/employee';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private api = inject(ApiService);
  private readonly endpoint = 'employees/';

  // 1. Definimos la señal privada (la que cambia) 
  // y la pública (la que el Dashboard lee)
  private _employees = signal<Employee[]>([]);
  public employees = this._employees.asReadonly();

  // 2. Método para cargar la lista inicial
  loadEmployees(): void {
    this.api.get<Employee[]>(this.endpoint).subscribe({
      next: (data) => this._employees.set(data),
      error: (err) => console.error('Error al cargar empleados:', err)
    });
  }

  // 3. POST: Al crear, "empujamos" el nuevo empleado a la señal
  createEmployee(employee: Employee): Observable<Employee> {
    return this.api.post<Employee>(this.endpoint, employee).pipe(
      tap((newEmp) => {
        // Actualizamos la señal añadiendo el nuevo al array existente
        this._employees.update(prev => [...prev, newEmp]);
      })
    );
  }

  // 4. PUT: Buscamos el empleado en la señal y lo actualizamos
  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.api.put<Employee>(`${this.endpoint}${id}/`, employee).pipe(
      tap((updatedEmp) => {
        this._employees.update(prev => 
          prev.map(e => e.id === id ? updatedEmp : e)
        );
      })
    );
  }

  // 5. DELETE: Filtramos el array para quitar el borrado
  deleteEmployee(id: number): Observable<any> {
    return this.api.delete(`${this.endpoint}${id}/`).pipe(
      tap(() => {
        this._employees.update(prev => prev.filter(e => e.id !== id));
      })
    );
  }
}