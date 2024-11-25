import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AddCategoryDialogComponent {
  @Output() closeDialog = new EventEmitter<void>();
  @Output() addCategoryEvent = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['EXPENSE', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.addCategoryEvent.emit(this.form.value);
      this.closeDialog.emit();
    }
  }

  onCancel(): void {
    this.closeDialog.emit();
  }
} 