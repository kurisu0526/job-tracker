import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Job, JobStatus, UpdateJobResponse } from '../../../models/job.model';
import { JobService } from '../../../services/job';
import { TruncatePipe } from './job-truncate.pipe';
import { ConfirmDialogComponent } from '../confirm-dialog.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-job-detail',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    TruncatePipe,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
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
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  job: Job | null = null;
  loading = signal(true);
  errorMessage = signal('');

  readonly statusOptions: JobStatus[] = ['saved', 'applied', 'interview', 'offer', 'rejected'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.jobService.getJob(id).subscribe({
      next: (job: Job) => {
        this.job = job;
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load job details.');
        this.loading.set(false);
      },
    });
  }

  updateStatus(status: JobStatus): void {
    if (!this.job) return;
    this.jobService.updateJob(this.job.id, { status }).subscribe({
      next: (updated: UpdateJobResponse) => (this.job = updated.job),
    });
  }

  deleteJob(): void {
    if (!this.job) return;
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Remove job application',
        message: 'Are you sure you want to remove this job application?',
      },
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.loading.set(true);
      this.jobService.deleteJob(this.job!.id).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/dashboard/jobs']).then(() => {
            this.snackBar.open('Job successfully removed!', 'Close', {
              duration: 5000,
              horizontalPosition: 'center' as MatSnackBarHorizontalPosition,
              verticalPosition: 'top' as MatSnackBarVerticalPosition,
              panelClass: ['snackbar-success'],
            });
          });
        }
      });
    });
  }

  editJob(): void {
    if (!this.job) return;
    this.router.navigate(['/dashboard/jobs', this.job.id, 'edit'], {
      state: { job: this.job },
    });
  }

  copyUrl(url: string): void {
    if (!url || !navigator.clipboard) return;
    navigator.clipboard.writeText(url).catch(() => {
      console.error('Unable to copy job URL to clipboard.');
    });
  }

  getStatusClass(status: JobStatus): string {
    return `status-${status}`;
  }
}
