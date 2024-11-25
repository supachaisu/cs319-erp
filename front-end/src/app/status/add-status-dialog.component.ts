import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-status-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-status-dialog.component.html'
})
export class AddStatusDialogComponent {
  @Output() closeDialog = new EventEmitter<void>();
  @Output() addStatusEvent = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.addStatusEvent.emit(this.form.value);
      this.closeDialog.emit();
    }
  }

  onCancel(): void {
    this.closeDialog.emit();
  }
} 