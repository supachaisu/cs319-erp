import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { CategoryRepositoryService } from '../services'
import type { Category, CategoryType, UpdateCategoryDto } from '../models'

@Component({
  selector: 'app-edit-category-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-category-dialog.component.html',
})
export class EditCategoryDialogComponent {
  @Input() category!: Category
  @Output() updateCategoryEvent = new EventEmitter<void>()
  @Output() closeDialog = new EventEmitter<void>()

  private fb = inject(FormBuilder)
  private categoryService = inject(CategoryRepositoryService)

  form = this.fb.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
  })

  ngOnInit() {
    this.form.patchValue({
      name: this.category.name,
      type: this.category.type,
    })
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.getRawValue()
      const updatedCategory: UpdateCategoryDto = {
        ...this.category,
        name: formValue.name!,
        type: formValue.type! as CategoryType,
      }

      this.categoryService.updateCategory(updatedCategory).subscribe({
        next: () => {
          this.updateCategoryEvent.emit()
          this.closeDialog.emit()
        },
        error: (error) => console.error('Error updating category:', error),
      })
    }
  }
} 