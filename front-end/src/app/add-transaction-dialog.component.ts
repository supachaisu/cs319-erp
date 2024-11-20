import { Component, EventEmitter, inject, Output } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { CreateTransactionDto, Transaction, TransactionType } from './models'
import { TransactionsRepositoryService } from './services'

@Component({
  selector: 'app-add-transaction-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-transaction-dialog.component.html',
})
export class AddTransactionDialogComponent {
  @Output() createTransactionEvent = new EventEmitter<Transaction[]>()
  @Output() closeDialog = new EventEmitter<void>()

  private formBuilder = inject(FormBuilder)
  private transactionsRepository = inject(TransactionsRepositoryService)

  form = this.formBuilder.group({
    type: ['EXPENSE', Validators.required],
    amount: ['', [Validators.required, Validators.min(0)]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    date: [new Date().toISOString().split('T')[0], [Validators.required]],
    status: ['PENDING'],
  })

  onSubmit(): void {
    if (this.form.valid) {
      const transaction: CreateTransactionDto = {
        type: this.form.value.type as TransactionType,
        amount: Number(this.form.value.amount),
        description: this.form.value.description as string,
        category: this.form.value.category as string,
      }

      this.transactionsRepository
        .createTransaction(transaction)
        .subscribe((transaction) => {
          this.createTransactionEvent.emit([transaction])
          this.closeDialog.emit()
        })
    }
  }

  onCancel(): void {
    this.closeDialog.emit()
  }
}
