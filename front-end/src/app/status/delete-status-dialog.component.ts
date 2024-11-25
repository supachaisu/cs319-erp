import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Status } from '../models/status.model';

@Component({
  selector: 'app-delete-status-dialog',
  standalone: true,
  templateUrl: './delete-status-dialog.component.html',
})
export class DeleteStatusDialogComponent {
  @Input() status!: Status;
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() closeDialog = new EventEmitter<void>();
} 