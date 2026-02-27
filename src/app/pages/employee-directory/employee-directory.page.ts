import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { EmployeeService } from 'src/app/core/services/employee-service';
import { BurnoutFormService } from 'src/app/core/services/burnout-form-service';
import { SearchBarComponent } from 'src/app/shared/components/search-bar/search-bar.component';

const DepartmentNames: Record<number, string> = {
    0: 'R&D',
    1: 'Sales',
    2: 'Human Resources'
  };

@Component({
  selector: 'app-employee-directory',
  templateUrl: './employee-directory.page.html',
  styleUrls: ['./employee-directory.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, SearchBarComponent ]
})

export class EmployeeDirectoryPage implements OnInit {
  private readonly CRITICAL_LIMIT = 70; 
  private readonly WARNING_LIMIT = 50;
  public employeeService = inject(EmployeeService);
  public burnoutService = inject(BurnoutFormService);
  public lastScores = signal<Record<number, number>>({});
  public lastEvaluationDates = signal<Record<number, string>>({});
  public searchText = signal<string>('');
  
  public filteredEmployees = computed(() => {
    const text = this.searchText().toLowerCase().trim();
    const all = this.employeeService.employees();
    
    all.forEach(emp => {
      if (emp.id) this.loadEmployeeScore(emp.id);
    });

    if (!text) return all;

    const filtered = all.filter(emp => {
      const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
      const deptId = emp.department as unknown as number;
      const deptName = DepartmentNames[deptId]?.toLowerCase() || '';
      const evaluationDate = this.lastEvaluationDates()[emp.id!] || '';

      return (
        fullName.includes(text) || 
        deptName.includes(text) || 
        evaluationDate.includes(text)
      );
    });

    // Llamamos a la función usando THIS
    filtered.forEach(emp => {
      if (emp.id) this.loadEmployeeScore(emp.id);
    });

    return filtered;
  });

  constructor(

  ) { }

  ngOnInit() {
    this.employeeService.loadEmployees();
  }

  private loadEmployeeScore(empId: number) {
    if (this.lastScores()[empId] !== undefined) return;

    this.burnoutService.getLastFormByEmployee(empId).subscribe({
      next: (form) => {
        this.lastScores.update(scores => ({
          ...scores,
          [empId]: form.burnout_score
        }));
        this.lastEvaluationDates.update(dates => ({
        ...dates,
          [empId]: form.created_at
        }));
      },
      error: () => {
        this.lastScores.update(scores => ({ ...scores, [empId]: -1 }));
        this.lastEvaluationDates.update(dates => ({ ...dates, [empId]: '' }));
      }
    });
  }

  public getDepartmentName(dept: any): string {
    const id = dept as number;
    return DepartmentNames[id] || 'Unknown';
  }

  getScoreBg(score: number): string {
    if (score >= this.CRITICAL_LIMIT) return '#fee2e2'; 
    if (score > this.WARNING_LIMIT) return '#fffbeb';  
    if (score <= this.WARNING_LIMIT) return '#f3f4f6';  
    return '#f3f4f6';                  
  }

  getScoreColor(score: number): string {
    if (score >= this.CRITICAL_LIMIT) return '#ef4444'; 
    if (score > this.WARNING_LIMIT) return '#d97706'; 
    if (score <= this.WARNING_LIMIT) return '#16a34a';  
    return '#374151';
  }
}
