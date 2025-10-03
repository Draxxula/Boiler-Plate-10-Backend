import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../_services/department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html'
})
export class DepartmentComponent implements OnInit {
  departments: any[] = [];

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getAll().subscribe({
      next: (data) => {
        this.departments = data;
        console.log('Departments loaded:', data); // 👀 debug
      },
      error: (err) => console.error('Error loading departments', err)
    });
  }
}
