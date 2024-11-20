import { Component, signal, computed } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Transaction } from './models'
import { AsyncPipe, DatePipe, NgClass, DecimalPipe } from '@angular/common'
import { Subscription, interval, firstValueFrom } from 'rxjs'
import { TransactionsRepositoryService } from './services/transactions-repository.service'
import { AddTransactionDialogComponent } from './add-transaction-dialog.component'

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

  constructor(private transactionsRepository: TransactionsRepositoryService) {}

  ngOnInit(): void {
    this.loadTransactions().then(() => {
      // Single polling subscription
      this.subscription = interval(1000).subscribe(() => {
        this.loadTransactions()
      })
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  async loadTransactions(): Promise<void> {
    const skip = this.startIndex()
    const take = this.itemsPerPage()

    const response = await firstValueFrom(
      this.transactionsRepository.getTransactions(
        this.sortColumn(),
        this.sortDirection(),
        skip,
        take,
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
