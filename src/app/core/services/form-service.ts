import { effect, inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api-service';
import { EmployeeService } from './employee-service';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private apiService = inject(ApiService);
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

    private fetchStatus(employeeId: number) {
        this.apiService.get<boolean>(`burnout-forms/employee/${employeeId}/has-this-week`)
          .subscribe({
            next: (status) => this._hasCompletedToday.set(status),
            error: () => this._hasCompletedToday.set(true)
          });
      }

}
