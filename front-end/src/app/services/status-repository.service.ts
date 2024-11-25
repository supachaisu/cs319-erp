import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Status, CreateStatusDto, UpdateStatusDto } from '../models/status.model';

@Injectable({
  providedIn: 'root'
})
export class StatusRepositoryService {
  private apiUrl = '/api/statuses';

  constructor(private http: HttpClient) {}

  getStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(this.apiUrl);
  }

  createStatus(status: CreateStatusDto): Observable<Status> {
    return this.http.post<Status>(this.apiUrl, status);
  }

  updateStatus(status: UpdateStatusDto): Observable<Status> {
    return this.http.put<Status>(`${this.apiUrl}/${status.id}`, status);
  }

  deleteStatus(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 