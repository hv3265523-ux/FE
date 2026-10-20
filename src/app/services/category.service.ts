import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CategoryPayload } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);

  // Đổi URL này cho khớp với API backend thực tế của bạn
  private readonly apiUrl = 'http://localhost:3000/api/categories';

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  create(payload: CategoryPayload): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, payload);
  }

  update(id: string, payload: CategoryPayload): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${encodeURIComponent(id)}`, payload);
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${encodeURIComponent(id)}`);
  }
};