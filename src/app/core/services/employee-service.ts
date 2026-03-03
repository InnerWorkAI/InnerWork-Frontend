import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { ApiService } from './api-service'
import { Employee } from '../../shared/models/employee';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private readonly endpoint = 'employees/';

  constructor() {
    effect(() => {
      // 1. Verificamos que esté autenticado
      if (this.auth.isAuthenticated()) {
        const role = this.auth.userRole();

        // 2. Si es Empleado y no tenemos sus datos, cargamos perfil
        if (role === 'user' && !this._currentEmployee()) {
          this.loadMyProfile();
        }

        // 3. Si es Admin y no tenemos los datos de empresa, cargamos empresa
        else if (role === 'admin' && !this._currentCompany()) {
          this.loadMyCompany();
        }
      }
    });
  }

  public userName = computed(() => {
    const user = this.auth.currentUser();
    const role = this.auth.userRole();

    if (!user) return 'Usuario';

    if (role === 'admin') {
      return this.currentCompany()?.name || 'Admin';
    }

    const employee = this.currentEmployee();
    if (employee) {
      return `${employee.first_name} ${employee.last_name}`;
    }

    return user.name || 'Cargando...';
  });

  // 1. Definimos la señal privada (la que cambia) 
  // y la pública (la que el Dashboard lee)
  private _employees = signal<Employee[]>([]);
  public employees = this._employees.asReadonly();

  private _currentEmployee = signal<Employee | null>(null);
  public currentEmployee = this._currentEmployee.asReadonly();

  private _currentCompany = signal<any | null>(null);
  public currentCompany = this._currentCompany.asReadonly();

  loadMyProfile(): void {
    if (this.auth.currentUser()?.role === 'admin') return;
    this.api.get<Employee>(`${this.endpoint}me`).subscribe({
      next: (data) => {
        this._currentEmployee.set(data);
      },
      error: (err) => console.error('Error al cargar perfil "me":', err)
    });
  }

  loadMyCompany(): void {
    this.api.get<any>(`companies`).subscribe({
      next: (data) => {
        this._currentCompany.set(data);
      },
      error: (err) => console.error('Error al cargar empresa:', err)
    });
  }

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
    return this.api.patch<Employee>(`${this.endpoint}${id}/`, employee).pipe(
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

  updateProfileImage(employeeId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.post<any>(`${this.endpoint}${employeeId}/profile-image`, formData).pipe(
      tap((response) => {
        const current = this._currentEmployee();
        if (current && current.id === employeeId) {
          this._currentEmployee.set({
            ...current,
            profile_image_url: response.profile_image_url
          });
        }

        this._employees.update(prev =>
          prev.map(e => e.id === employeeId ? { ...e, profile_image_url: response.profile_image_url } : e)
        );
      })
    );
  }
}