import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api-service';
import { BurnoutForm } from 'src/app/shared/models/burnout-form';
import { Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BurnoutFormService {
  private api = inject(ApiService);
  private readonly endpoint = 'burnout-forms';

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

  saveForm(data: BurnoutForm) {
    return this.api.post<BurnoutForm>(this.endpoint, data);
  }
}