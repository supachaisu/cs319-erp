import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { CreateTransactionDto, Transaction } from '../models'
import { Observable } from 'rxjs'

interface TransactionsResponse {
  transactions: Transaction[]
  total: number
}

@Injectable({
  providedIn: 'root',
})
export class TransactionsRepositoryService {
  constructor(private http: HttpClient) {}

  getTransactions(
    orderBy: keyof Transaction = 'date',
    orderDirection: 'desc' | 'asc' = 'desc',
    skip?: number,
    take?: number,
  ): Observable<TransactionsResponse> {
    const params = new HttpParams()
      .set('skip', skip?.toString() ?? '')
      .set('take', take?.toString() ?? '')
      .set('orderBy', orderBy)
      .set('orderDirection', orderDirection)

    return this.http.get<TransactionsResponse>('/api/transactions', { params })
  }

  createTransaction(
    transaction: CreateTransactionDto,
  ): Observable<Transaction> {
    return this.http.post<Transaction>('/api/transaction', transaction)
  }
}
