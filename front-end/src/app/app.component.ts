import { Component, signal, computed, ViewChild } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Transaction } from './models'
import { DatePipe, NgClass, DecimalPipe } from '@angular/common'
import {
  Subscription,
  interval,
  firstValueFrom,
  merge,
  tap,
  debounceTime,
} from 'rxjs'
import { TransactionsRepositoryService } from './services'
import { AddTransactionDialogComponent } from './add-transaction-dialog.component'
import { FormControl } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { NgApexchartsModule } from 'ng-apexcharts'

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexMarkers,
  ApexTooltip,
} from 'ng-apexcharts'

export type ChartOptions = {
  series: ApexAxisChartSeries
  chart: ApexChart
  xaxis: ApexXAxis
  yaxis: ApexYAxis
  grid: ApexGrid
  stroke: ApexStroke
  title: ApexTitleSubtitle
  markers: ApexMarkers
  tooltip: ApexTooltip
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    DatePipe,
    NgClass,
    DecimalPipe,
    AddTransactionDialogComponent,
    ReactiveFormsModule,
    NgApexchartsModule,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  @ViewChild('chart') chart!: ChartComponent
  chartOptions: Partial<ChartOptions> = {
    series: [
      {
        name: 'Daily Profit',
        data: [],
      },
    ],
    chart: {
      height: 350,
      type: 'line',
      zoom: { enabled: true },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['#030712'],
    },
    markers: {
      colors: ['#030712'],
      size: 4,
    },
    tooltip: {
      marker: {
        fillColors: ['#030712'],
      },
    },
    title: {
      text: 'Daily Profit/Loss',
      align: 'left',
    },
    yaxis: {
      labels: {
        formatter: (value: number) => {
          return (
            '฿' +
            new Intl.NumberFormat('en-US', {
              style: 'decimal',
            }).format(value)
          )
        },
      },
    },
  }

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

  // Add this property to track previous transactions
  private previousTransactions: string = ''

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

    await this.loadChartData()
  }

  async loadChartData(): Promise<void> {
    const response = await firstValueFrom(
      this.transactionsRepository.getTransactions(
        'date',
        'asc',
        undefined,
        undefined,
        this.typeFilter.value || undefined,
        this.categoryFilter.value || undefined,
      ),
    )

    // Check if transactions have changed
    const currentTransactions = JSON.stringify(response.transactions)
    if (currentTransactions === this.previousTransactions) {
      return
    }
    this.previousTransactions = currentTransactions

    const dailyProfits = response.transactions.reduce(
      (acc, transaction) => {
        const date = new Date(transaction.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
        const amount =
          transaction.type === 'EXPENSE'
            ? -transaction.amount
            : transaction.amount
        acc[date] = (acc[date] || 0) + amount
        return acc
      },
      {} as Record<string, number>,
    )

    const dates = Object.keys(dailyProfits).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    )
    const profits = dates.map((date) => dailyProfits[date])

    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          name: 'Daily Profit',
          data: profits,
        },
      ],
      xaxis: {
        categories: dates,
        labels: {
          rotateAlways: true,
        },
      },
    }
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
