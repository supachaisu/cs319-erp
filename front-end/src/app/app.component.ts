import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Transaction } from "./models";
import { AsyncPipe, DatePipe, NgClass, DecimalPipe } from "@angular/common";
import { Observable, Subscription, interval, switchMap, startWith, map } from "rxjs";
import { TransactionsRepositoryService } from "./services/transactions-repository.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, DatePipe, NgClass, DecimalPipe],
  templateUrl: "./app.component.html",
  styles: [],
})
export class AppComponent {
  // Holds the app title
  title = "front-end";

  // Observable stream of transactions
  transactions$!: Observable<Transaction[]>;

  // Local array to store current transactions
  transactions: Transaction[] = [];

  // Subscription to handle cleanup
  private subscription!: Subscription;

  sortColumn = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(private transactionsRepository: TransactionsRepositoryService) {}

  ngOnInit(): void {
    // Set up polling for transactions every 5 seconds
    this.transactions$ = this.transactionsRepository.getTransactions().pipe(
      switchMap((initial) =>
        interval(5000).pipe(
          // Get fresh transactions every 5 seconds
          switchMap(() => this.transactionsRepository.getTransactions()),
          // Use initial response immediately before first interval
          startWith(initial)
        )
      )
    );

    // Subscribe to transaction updates and store them locally
    this.subscription = this.transactions$.subscribe((transactions) => {
      this.updateTransactions(transactions);
    });
  }

  // Update local transactions array with new data
  private updateTransactions(transactions: Transaction[]): void {
    this.transactions = [...transactions]; // Create new array reference
  }

  // Cleanup subscription when component is destroyed
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  sort(column: keyof Transaction) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }

    this.transactions$ = this.transactions$.pipe(
      map(transactions => [...transactions].sort((a, b) => {
        const direction = this.sortDirection === 'asc' ? 1 : -1;
        
        if (column === 'amount') {
          return (a[column] - b[column]) * direction;
        }
        
        return String(a[column]).localeCompare(String(b[column])) * direction;
      }))
    );
  }
}
