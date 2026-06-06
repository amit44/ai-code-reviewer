import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { GeminiApiService } from '../../services/gemini-api.service';

@Component({
  selector: 'app-code-reviewer',
  templateUrl: './code-reviewer.component.html',
  styleUrls: ['./code-reviewer.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule
  ]
})
export class CodeReviewerComponent implements OnInit {
  codeInput: string = '';
  reviewResult: string = '';
  isLoading: boolean = false;
  hasError: boolean = false;
  errorMessage: string = '';
  requestCount: number = 0;
  maxRequests: number = 3;
  isCopied: boolean = false;

  constructor(private geminiService: GeminiApiService) { }

  ngOnInit(): void {
    const saved = sessionStorage.getItem('reviewCount');
    if (saved) {
      this.requestCount = parseInt(saved, 10);
    }
  }

  reviewCode(): void {
    if (this.requestCount >= this.maxRequests) {
      this.hasError = true;
      this.errorMessage = 'Demo limit reached. Maximum 3 reviews per session.';
      return;
    }

    this.isLoading = true;
    this.hasError = false;
    this.reviewResult = '';
    this.errorMessage = '';

    this.geminiService.reviewCode(this.codeInput).subscribe({
      next: (result: string) => {
        this.reviewResult = result;
        this.isLoading = false;
        this.requestCount++;
        sessionStorage.setItem('reviewCount', this.requestCount.toString());
      },
      error: (err: any) => {
        this.hasError = true;
        this.errorMessage = err.message || 'An error occurred while reviewing your code.';
        this.isLoading = false;
      }
    });
  }

  clearAll(): void {
    this.codeInput = '';
    this.reviewResult = '';
    this.hasError = false;
    this.errorMessage = '';
    this.isCopied = false;
  }

  getRemainingRequests(): number {
    return this.maxRequests - this.requestCount;
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.reviewResult).then(() => {
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 2000);
    });
  }
}