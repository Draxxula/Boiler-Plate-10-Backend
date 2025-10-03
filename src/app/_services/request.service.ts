// src/app/_services/request.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee.service';

export interface Request {
  id: number;
  type: 'Equipment' | 'Leave';
  items: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  employeeId: number;
  employee?: Employee;
  parsedItems?: { name: string; quantity: number }[];
}


@Injectable({ providedIn: 'root' })
export class RequestService {
  private baseUrl = `http://localhost:4000/requests`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Request[]> {
    return this.http.get<Request[]>(this.baseUrl);
  }

  getById(id: number): Observable<Request> {
    return this.http.get<Request>(`${this.baseUrl}/${id}`);
  }

  create(data: Request): Observable<Request> {
    return this.http.post<Request>(this.baseUrl, data);
  }

  update(id: number, data: Request): Observable<Request> {
    return this.http.put<Request>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
