import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { TransactionsRepositoryService } from '../services'
import type {
  Transaction,
  TransactionStatus,
  TransactionType,
  UpdateTransactionDto,
} from '../models'
import { CategoryRepositoryService } from '../services'

@Component({
  selector: 'app-edit-transaction-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-transaction-dialog.component.html',
})
export class EditTransactionDialogComponent {
  @Input() transaction!: Transaction
  @Output() updateTransactionEvent = new EventEmitter<void>()
  @Output() closeDialog = new EventEmitter<void>()

  private fb = inject(FormBuilder)
  private transactionService = inject(TransactionsRepositoryService)
  private categoryService = inject(CategoryRepositoryService)

  categories$ = this.categoryService.getCategories()

  form = this.fb.group({
    type: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0)]],
    description: ['', Validators.required],
    category: ['', Validators.required],
    status: ['', Validators.required],
    date: ['', Validators.required],
  })

  ngOnInit() {
    this.form.patchValue({
      type: this.transaction.type,
      amount: this.transaction.amount,
      description: this.transaction.description,
      category: this.transaction.category,
      status: this.transaction.status,
      date: new Date(this.transaction.date).toISOString().split('T')[0],
    })
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.getRawValue()
      const updatedTransaction: UpdateTransactionDto = {
        ...this.transaction,
        type: formValue.type! as TransactionType,
        amount: formValue.amount!,
        description: formValue.description!,
        category: formValue.category!,
        status: formValue.status! as TransactionStatus,
        date: formValue.date
          ? new Date(formValue.date).toISOString()
          : undefined,
      }

      this.transactionService.updateTransaction(updatedTransaction).subscribe({
        next: () => {
          this.updateTransactionEvent.emit()
          this.closeDialog.emit()
        },
        error: (error) => console.error('Error updating transaction:', error),
      })
    }
  }
}
