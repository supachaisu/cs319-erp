import {
  Component,
  EventEmitter,
  inject,
  Output,
  computed,
} from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common'
import type {
  CreateTransactionDto,
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../models'
import { TransactionsRepositoryService } from '../services'
import { CategoryRepositoryService } from '../services'
import { StatusRepositoryService } from '../services/status-repository.service'
import { toSignal } from '@angular/core/rxjs-interop'

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
  private categoryRepositoryService = inject(CategoryRepositoryService)
  private statusRepositoryService = inject(StatusRepositoryService)

  private categories = toSignal(
    this.categoryRepositoryService.getCategories(),
    { initialValue: [] },
  )

  statuses$ = this.statusRepositoryService.getStatuses()

  filteredCategories = computed(() => {
    const type = this.form.get('type')?.value
    return this.categories().filter((category) =>
      type === 'EXPENSE'
        ? category.type === 'EXPENSE'
        : category.type === 'INCOME',
    )
  })

  form = this.formBuilder.group({
    type: ['EXPENSE', Validators.required],
    amount: ['', [Validators.required, Validators.min(0)]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    date: [new Date().toISOString().split('T')[0], [Validators.required]],
    status: ['COMPLETED', Validators.required],
  })

  constructor() {
    this.form.get('type')?.valueChanges.subscribe(() => {
      this.form.patchValue({ category: '' })
      this.filteredCategories = computed(() => {
        const type = this.form.get('type')?.value
        return this.categories().filter((category) =>
          type === 'EXPENSE'
            ? category.type === 'EXPENSE'
            : category.type === 'INCOME',
        )
      })
    })
  }

  onSubmit(): void {
    if (this.form.valid) {
      const transaction: CreateTransactionDto = {
        type: this.form.value.type as TransactionType,
        amount: Number(this.form.value.amount),
        description: this.form.value.description as string,
        category: this.form.value.category as string,
        status: this.form.value.status as TransactionStatus,
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
