// src/app/admin/employees/employee.component.ts
import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeService } from '../../_services/employee.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransferEmployeeComponent } from './transfer-employee.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];  // 👈 This fixes the error

  constructor(
    private employeeService: EmployeeService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAll().subscribe({
      next: (data) => (this.employees = data),
      error: (err) => console.error(err),
    });
  }

  openTransfer(employee: any) {
  const modalRef = this.modalService.open(TransferEmployeeComponent);
  modalRef.componentInstance.employee = employee;

    modalRef.result.then((result) => {
      if (result === 'transferred') {
        this.loadEmployees();  // refresh table
      }
    }).catch(() => {});
  }
}