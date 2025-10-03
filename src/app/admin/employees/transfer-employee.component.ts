// transfer-employee.component.ts
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from '@app/_services';
import { DepartmentService } from '@app/_services/department.service';
//import { FormsModule } from '@angular/forms';

@Component({
  templateUrl: 'transfer-employee.component.html'
})
export class TransferEmployeeComponent {
  @Input() employee: any;
  selectedDepartmentId: number = 0;
  departments: any[] = [];


  constructor(
    public activeModal: NgbActiveModal,
    private employeeService: EmployeeService,
    private DepartmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.DepartmentService.getAll().subscribe({
      next: (data: any) => {
        this.departments = data;
        // Preselect current department if available
        if (this.employee?.department?.id) {
          this.selectedDepartmentId = this.employee.department.id;
        } else if (this.departments.length > 0) {
          // default to first department if none set
          this.selectedDepartmentId = this.departments[0].id;
        }
        console.log('Preselected department:', this.selectedDepartmentId);
      },
      error: (err: any) => console.error('Failed to load departments', err)
    });
  }

  transfer() {
    if (!this.selectedDepartmentId) return;

    console.log('Transferring', this.employee.employeeId, 'to department', this.selectedDepartmentId);

    this.employeeService.transferDepartment(this.employee.employeeId, this.selectedDepartmentId)
    .subscribe({
      next: (updatedEmployee: any) => {
        this.employee.department = updatedEmployee.department; // update locally
        this.activeModal.close('transferred');
      },
      error: (err: any) => console.error(err)
    });
  }



  
}
