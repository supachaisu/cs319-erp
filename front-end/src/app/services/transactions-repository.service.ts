import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
  CreateTransactionDto,
  Transaction,
  UpdateTransactionDto,
} from '../models'
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
    type?: string,
    category?: string,
    status?: string,
  ): Observable<TransactionsResponse> {
    const params = new HttpParams()
      .set('skip', skip?.toString() ?? '')
      .set('take', take?.toString() ?? '')
      .set('orderBy', orderBy)
      .set('orderDirection', orderDirection)
      .set('type', type ?? '')
      .set('category', category ?? '')
      .set('status', status ?? '')

    return this.http.get<TransactionsResponse>('/api/transactions', { params })
  }

  createTransaction(
    transaction: CreateTransactionDto,
  ): Observable<Transaction> {
    return this.http.post<Transaction>('/api/transaction', transaction)
  }

  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<void>(`/api/transaction/${id}`)
  }

  updateTransaction(
    transaction: UpdateTransactionDto,
  ): Observable<Transaction> {
    return this.http.put<Transaction>(
      `/api/transaction/${transaction.id}`,
      transaction,
    )
  }
}
