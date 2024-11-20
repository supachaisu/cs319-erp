import { Component, signal, computed } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Transaction } from './models'
import { AsyncPipe, DatePipe, NgClass, DecimalPipe } from '@angular/common'
import {
  Subscription,
  interval,
  firstValueFrom,
  merge,
  tap,
  debounceTime,
} from 'rxjs'
import { TransactionsRepositoryService } from './services/transactions-repository.service'
import { AddTransactionDialogComponent } from './add-transaction-dialog.component'
import { FormControl } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AsyncPipe,
    DatePipe,
    NgClass,
    DecimalPipe,
    AddTransactionDialogComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  transactions = signal<Transaction[]>([])
  sortColumn = signal<keyof Transaction>('date')
  sortDirection = signal<'asc' | 'desc'>('desc')

  private subscription!: Subscription

  isDialogOpen = false

  // Pagination
  itemsPerPage = signal(10)
  currentPage = signal(1)
  totalItems = signal<number>(0)
  totalPages = computed(() =>
    Math.ceil(this.totalItems() / this.itemsPerPage()),
  )
  startIndex = computed(() => (this.currentPage() - 1) * this.itemsPerPage())
  endIndex = computed(() =>
    Math.min(this.startIndex() + this.itemsPerPage(), this.totalItems()),
  )
  pageNumbers = computed(() => {
    const total = this.totalPages()
    return Array.from({ length: total }, (_, i) => i + 1)
  })

  typeFilter = new FormControl('')
  categoryFilter = new FormControl('')
  categories = signal<string[]>([])

  constructor(private transactionsRepository: TransactionsRepositoryService) {}

  ngOnInit(): void {
    // Set up filter subscriptions
    merge(this.typeFilter.valueChanges, this.categoryFilter.valueChanges)
      .pipe(
        tap(() => this.currentPage.set(1)),
        debounceTime(300),
      )
      .subscribe(() => this.loadTransactions())

    this.loadTransactions().then(() => {
      this.subscription = interval(1000).subscribe(() => {
        this.loadTransactions()
      })
    })

    this.loadCategories()
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  async loadCategories() {
    const categories = await this.transactionsRepository.getCategories()
    this.categories.set(categories)
  }

  async loadTransactions(): Promise<void> {
    const params = {
      skip: (this.currentPage() - 1) * this.itemsPerPage(),
      take: this.itemsPerPage(),
      orderBy: this.sortColumn(),
      orderDirection: this.sortDirection(),
      type: this.typeFilter.value || undefined,
      category: this.categoryFilter.value || undefined,
    }

    const response = await firstValueFrom(
      this.transactionsRepository.getTransactions(
        params.orderBy,
        params.orderDirection,
        params.skip,
        params.take,
        params.type,
        params.category,
      ),
    )
    this.transactions.set(response.transactions ?? [])
    this.totalItems.set(response.total)
  }

  sort(column: keyof Transaction, forceSortDirection?: 'asc' | 'desc') {
    if (this.sortColumn() === column) {
      this.sortDirection.set(
        forceSortDirection ?? (this.sortDirection() === 'asc' ? 'desc' : 'asc'),
      )
    } else {
      this.sortColumn.set(column)
      this.sortDirection.set(forceSortDirection ?? 'desc')
    }

    this.loadTransactions()
  }

  setPage(page: number) {
    this.currentPage.set(page)
    this.loadTransactions()
    const tableContainer = document.querySelector('.overflow-y-auto')
    if (tableContainer) {
      tableContainer.scrollTop = 0
    }
  }
}
