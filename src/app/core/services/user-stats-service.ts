import { computed, inject, Injectable, signal } from '@angular/core';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { BurnoutFormService } from './burnout-form-service';
import { EmployeeService } from './employee-service';
import { text } from 'ionicons/icons';

@Injectable({
  providedIn: 'root',
})
export class UserStatsService {
private burnoutService = inject(BurnoutFormService);
  private employeeService = inject(EmployeeService);

  public daysRange = signal<number>(28);

  public chartCategories = computed<string[]>(() => {
    const range = this.daysRange();
    const numBuckets = Math.ceil(range / 7);
    const categories: string[] = [];

    for (let i = numBuckets - 1; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - ((i + 1) * 7));
      const end = new Date();
      end.setDate(end.getDate() - (i * 7));
      categories.push(`${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`);
    }
    return categories;
  });

  public adminChartSeries = computed<ApexAxisChartSeries>(() => {
    const allForms = this.burnoutService.burnoutForms();
    if (!allForms.length) return [];

    const range = this.daysRange();
    const numBuckets = Math.ceil(range / 7);
    const satisfactionData: number[] = [];
    const aiStressData: number[] = [];

    for (let i = numBuckets - 1; i >= 0; i--) {
      const end = new Date(); end.setDate(end.getDate() - (i * 7));
      const start = new Date(); start.setDate(start.getDate() - ((i + 1) * 7));

      const latestPerEmployee = new Map<number, { sat: number, ai: number }>();
      
      allForms.forEach(f => {
        const d = new Date(f.created_at);
        if (d >= start && d < end) {
          const burnout = f.form_score!;
          const aiAverage = ((f.image_score ?? 0) + (f.text_score ?? 0)) / 2;
          latestPerEmployee.set(f.employee_id, { sat: 100 - burnout, ai: aiAverage });
        }
      });

      const values = Array.from(latestPerEmployee.values());
      if (values.length > 0) {
        satisfactionData.push(Math.round(values.reduce((a, b) => a + b.sat, 0) / values.length));
        aiStressData.push(Math.round(values.reduce((a, b) => a + b.ai, 0) / values.length));
      } else {
        satisfactionData.push(0); aiStressData.push(0);
      }
    }
    return [
      { name: 'Org. Satisfaction', data: satisfactionData },
      { name: 'Org. AI Stress', data: aiStressData }
    ];
  });


  public myPersonalSeries = computed<ApexAxisChartSeries>(() => {
    const myForms = this.burnoutService.myForms()
    const range = this.daysRange();
    const numBuckets = Math.ceil(range / 7);
    const satisfactionData: number[] = [];
    const aiStressData: number[] = [];

    for (let i = numBuckets - 1; i >= 0; i--) {
      const end = new Date(); end.setDate(end.getDate() - (i * 7));
      const start = new Date(); start.setDate(start.getDate() - ((i + 1) * 7));

      const formInWeek = myForms.filter(f => {
        const d = new Date(f.created_at);
        return d >= start && d < end;
      }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

      if (formInWeek) {
        satisfactionData.push(Math.round(100 - formInWeek.form_score!));
        aiStressData.push(Math.round(((formInWeek.image_score ?? 0) + (formInWeek.text_score ?? 0)) / 2));
      } else {
        satisfactionData.push(0); aiStressData.push(0);
      }
    }
    return [
      { name: 'My Satisfaction', data: satisfactionData },
      { name: 'My AI Stress', data: aiStressData }
    ];
  });
}
