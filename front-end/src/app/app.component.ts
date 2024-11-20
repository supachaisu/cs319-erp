import { Component, signal } from '@angular/core'
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
  // Holds the app title
  title = 'front-end'

  // Local array to store current transactions
  transactions = signal<Transaction[]>([])

  // Subscription to handle cleanup
  private subscription!: Subscription

  sortColumn = signal<keyof Transaction>('date')
  sortDirection = signal<'asc' | 'desc'>('desc')

  isDialogOpen = false

  constructor(private transactionsRepository: TransactionsRepositoryService) {}

  ngOnInit(): void {
    // Initial load and sort
    this.loadTransactions().then(() =>
      this.sortTransactions(this.sortColumn(), this.sortDirection()),
    )

    // Single polling subscription
    this.subscription = interval(1000).subscribe(() => {
      this.loadTransactions().then(() =>
        this.sortTransactions(this.sortColumn(), this.sortDirection()),
      )
    })
  }

  private async loadTransactions(): Promise<void> {
    const transactions = await firstValueFrom(
      this.transactionsRepository.getTransactions(),
    )
    this.transactions.set(transactions ?? [])
  }

  mergeTransactions(transactions: Transaction[]): void {
    this.transactions.update((current) => {
      const uniqueTransactions = [...new Set([...current, ...transactions])]
      return uniqueTransactions
    })
    console.log('Sort Direction', this.sortDirection())
    this.sort(this.sortColumn(), this.sortDirection())
  }

  // Cleanup subscription when component is destroyed
  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
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

    this.sortTransactions(column, this.sortDirection())
  }

  private sortTransactions(
    column: keyof Transaction,
    direction: 'asc' | 'desc',
  ): void {
    const sortMultiplier = direction === 'asc' ? 1 : -1
    this.transactions.update((transactions) =>
      [...transactions].sort((a, b) => {
        if (column === 'amount') {
          return (a[column] - b[column]) * sortMultiplier
        }
        return (
          String(a[column]).localeCompare(String(b[column])) * sortMultiplier
        )
      }),
    )
  }
}
