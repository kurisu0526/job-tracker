import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Job, JobStatus } from '../../../models/job.model';
import { JobService } from '../../../services/job';

@Component({
  selector: 'app-job-detail',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSelectModule,
  ],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.scss',
})
export class JobDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);
  private router = inject(Router);

  job: Job | null = null;
  loading = true;
  errorMessage = '';

  readonly statusOptions: JobStatus[] = ['saved', 'applied', 'interview', 'offer', 'rejected'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.jobService.getJob(id).subscribe({
      next: (job: Job) => {
        this.job = job;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load job details.';
        this.loading = false;
      },
    });
  }

  updateStatus(status: JobStatus): void {
    if (!this.job) return;
    this.jobService.updateJob(this.job.id, { status }).subscribe({
      next: (updated: Job) => (this.job = updated),
    });
  }

  deleteJob(): void {
    if (!this.job || !confirm('Delete this job application?')) return;
    this.jobService.deleteJob(this.job.id).subscribe({
      next: () => this.router.navigate(['/dashboard/jobs']),
    });
  }

  getStatusClass(status: JobStatus): string {
    return `status-${status}`;
  }
}
