import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JobService } from '../../../services/job';
import { JobStatus } from '../../../models/job.model';

@Component({
  selector: 'app-add-job',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './add-job.html',
  styleUrl: './add-job.scss',
})
export class AddJobComponent {
  private fb = inject(FormBuilder);
  private jobService = inject(JobService);
  private router = inject(Router);

  form = this.fb.group({
    company: ['', Validators.required],
    position: ['', Validators.required],
    location: ['', Validators.required],
    status: ['applied' as JobStatus, Validators.required],
    salary: [''],
    appliedDate: [new Date().toISOString().slice(0, 10), Validators.required],
    notes: [''],
    url: [''],
  });

  loading = false;
  errorMessage = '';

  readonly statusOptions: { value: JobStatus; label: string }[] = [
    { value: 'saved', label: 'Saved' },
    { value: 'applied', label: 'Applied' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
  ];

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    const value = this.form.getRawValue();
    this.jobService
      .createJob({
        company: value.company!,
        position: value.position!,
        location: value.location!,
        status: value.status as JobStatus,
        salary: value.salary || undefined,
        appliedDate: value.appliedDate!,
        notes: value.notes || undefined,
        url: value.url || undefined,
      })
      .subscribe({
        next: () => this.router.navigate(['/dashboard/jobs']),
        error: (err: { error?: { message?: string } }) => {
          this.errorMessage = err?.error?.message ?? 'Failed to save job. Please try again.';
          this.loading = false;
        },
      });
  }
}
