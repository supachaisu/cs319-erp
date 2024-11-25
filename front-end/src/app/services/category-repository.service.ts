import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../models/category.model'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CategoryRepositoryService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories')
  }

  createCategory(category: CreateCategoryDto): Observable<Category> {
    return this.http.post<Category>('/api/categories', category)
  }

  updateCategory(category: UpdateCategoryDto): Observable<Category> {
    return this.http.put<Category>(`/api/categories/${category.id}`, category)
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`/api/categories/${id}`)
  }
} 