import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JobService } from '../../../services/job';
import { Job, JobStatus, UpdateJobResponse } from '../../../models/job.model';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-edit-job',
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
    MatChipsModule
  ],
  templateUrl: './edit-job.html',
  styleUrl: './edit-job.scss',
})
export class EditJobComponent implements OnInit {
  private fb = inject(FormBuilder);
  private jobService = inject(JobService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  job: Job | null = null;
  errorMessage = signal('');
  loading = signal(true);

  readonly statusOptions: { value: JobStatus; label: string }[] = [
    { value: 'saved', label: 'Saved' },
    { value: 'applied', label: 'Applied' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
  ];

  form = this.fb.group({
    companyName: ['', Validators.required],
    jobTitle: ['', Validators.required],
    location: ['', Validators.required],
    status: ['applied' as JobStatus, Validators.required],
    salary: [''],
    appliedDate: ['', Validators.required],
    notes: [''],
    url: [''],
    tags: [[] as string[]],
  });

  get tagsControl() {
    return this.form.get('tags');
  }

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id')!;
    const state = history.state;
    // Try to get job from router state first
    const jobFromState = state?.['job'] as Job | undefined;
    console.log('Job from state:', jobFromState);
    if (jobFromState) {
      this.populateForm(jobFromState);
      this.job = jobFromState;
      this.loading.set(false);
    } else {
      // Fallback: load from service
      this.jobService.getJob(jobId).subscribe({
        next: (job: Job) => {
          this.populateForm(job);
          this.job = job;
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Failed to load job details.');
          this.loading.set(false);
        },
      });
    }
  }

  private populateForm(job: Job): void {
    this.form.patchValue({
      companyName: job.company,
      jobTitle: job.position,
      location: job.location,
      status: job.status,
      salary: job.salary || '',
      appliedDate: job.appliedDate,
      notes: job.notes || '',
      url: job.url || '',
      tags: job.tags || [],
    });
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const currentTags = this.tagsControl?.value || [];
      this.tagsControl?.setValue([...currentTags, value]);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    const currentTags = this.tagsControl?.value || [];
    const updatedTags = currentTags.filter((t: string) => t !== tag);
    this.tagsControl?.setValue(updatedTags);
  }

  onSubmit(): void {
    if (this.form.invalid || !this.job) return;
    
    this.loading.set(true);
    this.errorMessage.set('');
    
    const value = this.form.getRawValue();
    this.jobService
      .updateJob(this.job.id, {
        company: value.companyName!,
        position: value.jobTitle!,
        location: value.location!,
        status: value.status as JobStatus,
        salary: value.salary || '',
        appliedDate: value.appliedDate!,
        notes: value.notes || '',
        url: value.url || '',
        tags: value.tags || [],
      })
      .subscribe({
        next: (updated: UpdateJobResponse) => {
          this.loading.set(false);
          console.log(updated);
          this.router.navigate(['/dashboard/jobs', this.job?.id]).then(() => {
            this.snackBar.open('Job successfully updated!', 'Close', {
              duration: 5000,
              horizontalPosition: 'center' as MatSnackBarHorizontalPosition,
              verticalPosition: 'top' as MatSnackBarVerticalPosition,
              panelClass: ['snackbar-success'],
            });
          });
        },
        error: (err: { error?: { message?: string } }) => {
          this.errorMessage.set(err?.error?.message ?? 'Failed to update job. Please try again.');
          this.loading.set(false);
        },
      });
  }
}
