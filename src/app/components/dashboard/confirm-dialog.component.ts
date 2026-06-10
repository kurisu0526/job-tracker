import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="confirm-root">
      <h2 class="confirm-title">{{ data?.title || 'Confirm' }}</h2>
      <p class="confirm-message">{{ data?.message || 'Are you sure?' }}</p>
      <div class="confirm-actions">
        <button mat-stroked-button (click)="close(false)">No</button>
        <button mat-raised-button color="warn" (click)="close(true)">Yes</button>
      </div>
    </div>
  `,
  styles: [
    `.confirm-root { padding: 24px 20px; max-width: 420px; }
     .confirm-title { margin: 0 0 8px; font-size: 1.1rem; }
     .confirm-message { margin: 0 0 16px; color: rgba(255,255,255,0.8); }
     .confirm-actions { display: flex; justify-content: flex-end; gap: 8px; }
    `,
  ],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: { title?: string | null; message?: string | null }
  ) {}

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
