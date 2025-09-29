import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private apiUrl = 'http://localhost:4000/departments'; // 👈 adjust backend API

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(department: any): Observable<any> {
    return this.http.post(this.apiUrl, department);
  }

  update(id: number, department: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, department);
  }
}
