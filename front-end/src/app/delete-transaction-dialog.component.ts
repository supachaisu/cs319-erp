import { Component, EventEmitter, Input, Output } from '@angular/core'
import type { Transaction } from './models'

@Component({
  selector: 'app-delete-transaction-dialog',
  standalone: true,
  templateUrl: './delete-transaction-dialog.component.html',
})
export class DeleteTransactionDialogComponent {
  @Input() transaction!: Transaction
  @Output() confirmDelete = new EventEmitter<void>()
  @Output() closeDialog = new EventEmitter<void>()
}
