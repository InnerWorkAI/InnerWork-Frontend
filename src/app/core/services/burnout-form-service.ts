import { effect, inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api-service';
import { BurnoutForm, BurnoutRequest } from 'src/app/shared/models/burnout-form';
import { filter, firstValueFrom, map, Observable, tap, timeout } from 'rxjs';
import { EmployeeService } from './employee-service';
import { toObservable } from '@angular/core/rxjs-interop';


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
      if (employee) {
        this.fetchStatus(employee.id!);
        this.loadMyForms(employee.id!);
      }
      


    });
  }

  private mapScores(forms: BurnoutForm[]): BurnoutForm[] {
    return forms.map(form => {
      if (typeof form.burnout_score === 'string') {
        const scores = form.burnout_score.split(',').map(s => parseInt(s.trim(), 10));

        form.image_score = scores[0] ?? 0;
        form.text_score = scores[1] ?? 0;
        form.form_score = scores[2] ?? 0;
      }
      return form;
    });
  }

  public burnoutForms = signal<BurnoutForm[]>([]);
  public myForms = signal<BurnoutForm[]>([]);

  loadAll() {
    this.api.get<BurnoutForm[]>(this.endpoint).subscribe(data => {
      const processedData = this.mapScores(data);
      this.burnoutForms.set(processedData);
    });
  }

  loadMyForms(employeeId: number) {
    this.getFormsByEmployee(employeeId).subscribe(data => {
      const processedData = this.mapScores(data);
      this.myForms.set(processedData);
    });
  }

  getLastFormByEmployee(employeeId: number): Observable<BurnoutForm> {
    return this.api.get<BurnoutForm>(`${this.endpoint}/employee/${employeeId}/last`).pipe(
      tap(form => this.mapScores([form]))
    );
  }

  getFormsByEmployee(employeeId: number): Observable<BurnoutForm[]> {
    return this.api.get<BurnoutForm[]>(`${this.endpoint}/employee/${employeeId}`).pipe(
      map(data => this.mapScores(data))
    );
  }

  saveForm(data: FormData) {
    return this.api.post<any>(this.endpoint, data).pipe(
      tap(() => {
        this._hasCompletedToday.set(true); 
        console.log('Signal actualizada a true tras el envío');
      })
    );
  }

  private fetchStatus(employeeId: number) {
    this.api.get<any>(`burnout-forms/employee/${employeeId}/has-this-week`)
      .subscribe({
        next: (res) => {
          const status = (typeof res === 'object' && res !== null) 
                        ? res.has_form_this_week 
                        : res;
          
          this._hasCompletedToday.set(!!status);
        },
        error: () => this._hasCompletedToday.set(false)
      });
  }


}