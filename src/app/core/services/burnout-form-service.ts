import { effect, inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api-service';
import { BurnoutForm, BurnoutRequest } from 'src/app/shared/models/burnout-form';
import { Observable, tap } from 'rxjs';
import { EmployeeService } from './employee-service';


@Injectable({
  providedIn: 'root'
})
export class BurnoutFormService {
  private api = inject(ApiService);
  private readonly endpoint = 'burnout-forms';

  private employeeService = inject(EmployeeService);

  private _hasCompletedToday = signal<boolean | undefined>(undefined);
  public hasCompletedToday = this._hasCompletedToday.asReadonly();

  constructor() {
    effect(() => {
      const employee = this.employeeService.currentEmployee();

      if (employee && this._hasCompletedToday() === undefined) {
        this.fetchStatus(employee.id!);
      }
    });
  }

  // Señal que almacena todos los formularios cargados
  public burnoutForms = signal<BurnoutForm[]>([]);

  getLastFormByEmployee(employeeId: number): Observable<BurnoutForm> {
    return this.api.get<BurnoutForm>(`${this.endpoint}/employee/${employeeId}/last`);
  }

  loadAll() {
    this.api.get<BurnoutForm[]>(this.endpoint).subscribe(data => {
      this.burnoutForms.set(data);
    });
  }

  saveForm(data: FormData) {
    return this.api.post<FormData>(this.endpoint, data);
  }

  private fetchStatus(employeeId: number) {
    this.api.get<boolean>(`burnout-forms/employee/${employeeId}/has-this-week`)
      .subscribe({
        next: (status) => this._hasCompletedToday.set(status),
        error: () => this._hasCompletedToday.set(true)
      });
  }
}