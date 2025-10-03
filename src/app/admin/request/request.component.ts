// src/app/admin/request/request.component.ts
import { Component, OnInit } from '@angular/core';
import { Request, RequestService } from '@app/_services/request.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html'
})
export class RequestComponent implements OnInit {
  requests: Request[] = [];

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
  this.requestService.getAll().subscribe({
    next: (data) => {
      this.requests = data.map(req => ({
        ...req,
        parsedItems: this.parseItems(req.items)
      }));
    },
    error: (err) => console.error(err)
  });
}
  private parseItems(items: any) {
    try {
      if (typeof items === 'string') {
        return JSON.parse(items); // if stored as JSON string in DB
      }
      return items; // already array
    } catch {
      return []; // fallback if parsing fails
    }
  }
}