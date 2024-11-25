import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  inject,
} from '@angular/core'
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
import { StatusRepositoryService } from '../services'
import { toSignal } from '@angular/core/rxjs-interop'

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
  private categoryRepositoryService = inject(CategoryRepositoryService)
  private statusRepositoryService = inject(StatusRepositoryService)

  private categories = toSignal(
    this.categoryRepositoryService.getCategories(),
    { initialValue: [] },
  )

  filteredCategories = computed(() => {
    const type = this.form.get('type')?.value
    return this.categories().filter((category) =>
      type === 'EXPENSE'
        ? category.type === 'EXPENSE'
        : category.type === 'INCOME',
    )
  })

  statuses$ = this.statusRepositoryService.getStatuses()

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

    this.form.get('type')?.valueChanges.subscribe(() => {
      this.filteredCategories = computed(() => {
        const type = this.form.get('type')?.value
        return this.categories().filter((category) =>
          type === 'EXPENSE'
            ? category.type === 'EXPENSE'
            : category.type === 'INCOME',
        )
      })
      this.form.patchValue({
        category: this.filteredCategories()[0].name,
      })
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
