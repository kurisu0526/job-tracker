import { Component, inject, signal } from '@angular/core';
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
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JobService } from '../../../services/job';
import { JobStatus } from '../../../models/job.model';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';



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
    MatChipsModule
  ],
  templateUrl: './add-job.html',
  styleUrl: './add-job.scss',
})
export class AddJobComponent {
  private fb = inject(FormBuilder);
  private jobService = inject(JobService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  errorMessage = signal('');
  scrapeErrorMessage = signal('');
  loading = signal(false);

  

  readonly jobSourceUrl: { value: string; label: string }[] = [
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'jobstreet', label: 'JobStreet' },
  ];

  scrapeForm = this.fb.group({
    url: ['', Validators.required]
  });

  form = this.fb.group({
    companyName: ['', Validators.required],
    jobTitle: ['', Validators.required],
    location: ['', Validators.required],
    status: ['applied' as JobStatus, Validators.required],
    salary: [''],
    appliedDate: [new Date().toISOString().slice(0, 10), Validators.required],
    notes: [''],
    url: [''],
    tags: [[] as string[]],
  });

  get tagsControl() { return this.form.get('tags'); }


  readonly statusOptions: { value: JobStatus; label: string }[] = [
    { value: 'saved', label: 'Saved' },
    { value: 'applied', label: 'Applied' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
  ];

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const currentTags = this.tagsControl?.value || [];
      this.tagsControl?.setValue([...currentTags, value]); // Update form state
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    const currentTags = this.tagsControl?.value || [];
    const updatedTags = currentTags.filter((t: string) => t !== tag);
    this.tagsControl?.setValue(updatedTags); // Update form state
  }

  onScrapeSubmit(): void {
    if (this.scrapeForm.invalid) return;
    const value = this.scrapeForm.getRawValue();
    this.loading.set(true);
    this.scrapeErrorMessage.set('');
    this.jobService.scrapeJob(value.url ?? '', this.jobSourceUrl[0]?.value ?? '').subscribe({
      next: (scrapedData) => {
        // Pre-fill the main form with scraped data
        let tags = this.getTagsFromScrapedData(scrapedData);
        this.form.patchValue(scrapedData);
        this.tagsControl?.setValue(tags);
        this.loading.set(false);
      },
      error: (err) => {
        this.scrapeErrorMessage.set(err?.error?.message ?? 'Failed to scrape job information. Please try again.');
        this.loading.set(false);
      }
    });
  }

  getTagsFromScrapedData(scrapedData: any): string[] {
    // This function can be enhanced to extract tags from scraped data based on your requirements
    let tags = [];
    if(scrapedData.jobCriteria) {
      for(const key in scrapedData.jobCriteria) {
        if(scrapedData.jobCriteria[key]) {
          tags.push(scrapedData.jobCriteria[key]);
        }
      }
    }
    return tags;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set('') ;
    const value = this.form.getRawValue();
    this.jobService
      .createJob({
        company: value.companyName!,
        position: value.jobTitle!,
        location: value.location!,
        status: value.status as JobStatus,
        salary: value.salary || undefined,
        appliedDate: value.appliedDate!,
        notes: value.notes || undefined,
        url: value.url || undefined,
        tags: value.tags || undefined, // You can add tag handling later
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard/jobs']).then(() => {
            this.snackBar.open('Job successfully added!', 'Close', {
              duration: 5000,
              horizontalPosition: 'center' as MatSnackBarHorizontalPosition,
              verticalPosition: 'top' as MatSnackBarVerticalPosition,
              panelClass: ['snackbar-success'] // Applies custom token variables
            });
          });
        },
        error: (err: { error?: { message?: string } }) => {
          this.errorMessage.set(err?.error?.message ?? 'Failed to save job. Please try again.');
          this.loading.set(false);
        },
      });
  }
}
