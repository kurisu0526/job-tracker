import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { Job, JobListResponse, JobStatus } from '../../../models/job.model';
import { JobService } from '../../../services/job';

@Component({
  selector: 'app-jobs-list',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './jobs-list.html',
  styleUrl: './jobs-list.scss',
})
export class JobsListComponent implements OnInit {
  private jobService = inject(JobService);
  private router = inject(Router);

  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  loading = signal(false);
  errorMessage = signal('');
  searchQuery = '';
  statusFilter: JobStatus | '' = '';

  readonly displayedColumns = ['company', 'position', 'salary', 'location', 'status', 'appliedDate', 'actions'];

  readonly statusOptions: { value: JobStatus | ''; label: string }[] = [
    { value: '', label: 'All Statuses' },
    { value: 'saved', label: 'Saved' },
    { value: 'applied', label: 'Applied' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
  ];

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.jobService.getJobs().subscribe({
      next: (response: JobListResponse) => {
        this.jobs = response.jobs;
        this.applyFilters();
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load jobs. Please try again.');
        this.loading.set(false);
      },
    });
  }

  applyFilters(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredJobs = this.jobs.filter((j) => {
      const matchesSearch =
        !q ||
        j.company.toLowerCase().includes(q) ||
        j.position.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q);
      const matchesStatus = !this.statusFilter || j.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  deleteJob(id: string): void {
    if (!confirm('Delete this job?')) return;
    this.jobService.deleteJob(id).subscribe({
      next: () => {
        this.jobs = this.jobs.filter((j) => j.id !== id);
        this.applyFilters();
      },
    });
  }

  getStatusClass(status: JobStatus): string {
    return `status-${status}`;
  }
}
