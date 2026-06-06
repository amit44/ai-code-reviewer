import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeminiApiService {

  private apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private apiKey = 'API_KEY_HERE';

  constructor(private http: HttpClient) {}

  reviewCode(code: string): Observable<string> {
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };

    const body = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a senior Angular and TypeScript 
developer. Review the provided code and respond 
in EXACTLY this format:

BUGS FOUND:
- (list each bug with explanation)

PERFORMANCE ISSUES:
- (list each performance problem)

BEST PRACTICE VIOLATIONS:
- (list each violation)

SEVERITY: HIGH or MEDIUM or LOW

IMPROVED CODE:
(paste complete rewritten clean version with 
comments explaining each change)`
        },
        {
          role: 'user',
          content: `Review this code:\n\n${code}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2048
    };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(response => response.choices[0].message.content),
      catchError(error => {
        console.error('Groq API Error:', error);
        return throwError(() =>
          new Error('Failed to get review. Please try again.')
        );
      })
    );
  }
}