import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { CreateTransactionDto, Transaction } from '../models'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TransactionsRepositoryService {
  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>('/api/transactions')
  }

  createTransaction(
    transaction: CreateTransactionDto,
  ): Observable<Transaction> {
    return this.http.post<Transaction>('/api/transaction', transaction)
  }
}
