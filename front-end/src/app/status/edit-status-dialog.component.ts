import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatusRepositoryService } from '../services/status-repository.service';
import type { Status, UpdateStatusDto } from '../models/status.model';

@Component({
  selector: 'app-edit-status-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-status-dialog.component.html',
})
export class EditStatusDialogComponent {
  @Input() status!: Status;
  @Output() updateStatusEvent = new EventEmitter<void>();
  @Output() closeDialog = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private statusService = inject(StatusRepositoryService);

  form = this.fb.group({
    name: ['', Validators.required],
  });

  ngOnInit() {
    this.form.patchValue({
      name: this.status.name,
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const updatedStatus: UpdateStatusDto = {
        ...this.status,
        name: formValue.name!,
      };

      this.statusService.updateStatus(updatedStatus).subscribe({
        next: () => {
          this.updateStatusEvent.emit();
          this.closeDialog.emit();
        },
        error: (error) => console.error('Error updating status:', error),
      });
    }
  }
} 