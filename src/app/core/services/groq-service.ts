import { inject, Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { Message } from 'src/app/shared/models/Message';
import { environment } from 'src/environments/environment';
import { ApiService } from './api-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BurnoutFormService } from './burnout-form-service';
import { EmployeeService } from './employee-service';

@Injectable({
  providedIn: 'root',
})
export class GroqService {
  private groqUrl = 'https://api.groq.com/openai/v1/chat/completions';
  constructor() {

  }

  http = inject(HttpClient);
  burnoutFormService = inject(BurnoutFormService);
  employeeService = inject(EmployeeService);

  getChatResponse(messages: Message[]): Observable<string> {
    const employeeId = this.employeeService.currentEmployee()?.id;

    if (!employeeId) {
      console.error('No hay empleado activo');
      return of('Error: No se pudo identificar al empleado.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.groqKey}`,
      'Content-Type': 'application/json'
    });

    return this.burnoutFormService.getLastFormByEmployee(employeeId).pipe(
      switchMap(form => {
        const formContext = form ? `Employee burnout context: ${JSON.stringify(form)}` : 'No previous employee burnout data.';

        const systemMessage = {
          role: 'system',
          content: `You are InnerWork AI, an expert assistant in occupational psychology and workplace well-being. 
          Your goal is to help employees manage stress and prevent burnout.
          Guidelines:
          - Be empathetic, calm, and professional.
          - Keep responses concise (max 2-3 paragraphs).
          - If the user mentions severe symptoms, suggest contacting HR or a mental health professional.
          - Focus on actionable advice like time management, mindfulness, and healthy boundaries.
          
          ${formContext}`
        };

        const cleanMessages = [
          systemMessage,
          ...messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        ];

        const body = {
          model: 'llama-3.3-70b-versatile',
          messages: cleanMessages,
          temperature: 0.7
        };

        return this.http.post<any>(this.groqUrl, body, { headers }).pipe(
          map(res => res.choices[0].message.content)
        );
      })
    );
  }
}

