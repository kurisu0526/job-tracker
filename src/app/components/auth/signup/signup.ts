import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal('');
  loading = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  hidePassword = true;

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set('');
    const { name, email, password } = this.form.getRawValue();
    this.auth.register({ name: name!, email: email!, password: password! }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.errorMessage.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
