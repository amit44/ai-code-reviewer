import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CodeReviewerComponent } from './components/code-reviewer/code-reviewer.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CodeReviewerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ai-code-reviewer';
}
