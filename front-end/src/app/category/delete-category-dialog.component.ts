import { Component, EventEmitter, Input, Output } from '@angular/core'
import type { Category } from '../models'

@Component({
  selector: 'app-delete-category-dialog',
  standalone: true,
  templateUrl: './delete-category-dialog.component.html',
})
export class DeleteCategoryDialogComponent {
  @Input() category!: Category
  @Output() confirmDelete = new EventEmitter<void>()
  @Output() closeDialog = new EventEmitter<void>()
} 