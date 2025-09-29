import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService } from '@app/_services';
import { AccountService } from '@app/_services';
//import { AccountService } from '../accounts/account.service';
import { DepartmentService } from '../departments/department.service';
import { EmployeeService } from './employee.service';

@Component({
  templateUrl: './add-employee.component.html'
})
export class AddEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  accounts: any[] = [];
  departments: any[] = [];
  selectedAccount: any; // for syncing status

    statuses: string[] = ['Active', 'Inactive'];

    loading = false;
    submitting = false;
    submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private alertService: AlertService
  ) {}

  currentYearEnd!: string;

  ngOnInit() {
    this.employeeForm = this.fb.group({
      employeeId: ['', Validators.required],
      accountId: ['', Validators.required],
      position: ['', Validators.required],
      departmentId: ['', Validators.required],
      hireDate: ['', Validators.required],
      status: ['', Validators.required] 
    });

    this.loadAccounts();
    this.loadDepartments();
    this.generateNextEmployeeId();

    // Load statuses from accounts if needed
    this.statuses = ['Active', 'Inactive']; // or from API later

    const now = new Date();

  this.currentYearEnd = `${now.getFullYear()}-12-31`;
  }

    get f() { return this.employeeForm.controls; }
    
    loadAccounts() {
    this.accountService.getAll().subscribe((data: any[]) => {
      //Only include accounts with status Active
      this.accounts = data.filter(acc => acc.status === 'Active');
    });
  }

    loadDepartments() {
      this.departmentService.getAll().subscribe(data => {
        this.departments = data;
      });
    }

    onAccountChange(accountId: string) {
    this.selectedAccount = this.accounts.find(acc => acc.id == accountId);
    if (this.selectedAccount) {
      // Set employee status to match the selected account
      this.employeeForm.patchValue({ status: this.selectedAccount.status });
    }
  }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
  
    console.log("Submitting form data:", this.employeeForm.value);
  
    if (this.employeeForm.invalid) return;
  
      this.submitting = true;

          // Create employee data
      this.accountService.create(this.employeeForm.value)

        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success('Employee Created', { keepAfterRouteChange: true });
            this.router.navigateByUrl('/admin/employees');
            },
            error: error => {
            this.alertService.error(error);
            this.submitting = false;
            }
        });
    }

  generateNextEmployeeId() {
    this.employeeService.getAll().subscribe((employees: any[]) => {
      if (employees.length > 0) {
        // sort by employeeId to get last one
        const lastEmployee = employees.sort((a, b) => 
          a.employeeId.localeCompare(b.employeeId)
        ).pop();

        const lastId = lastEmployee.employeeId; // e.g. "EMP001"
        const num = parseInt(lastId.replace(/\D/g, ''), 10); // extract number part
        const nextId = 'EMP' + (num + 1).toString().padStart(3, '0');

        this.employeeForm.patchValue({ employeeId: nextId });
      } else {
        // first employee
        this.employeeForm.patchValue({ employeeId: 'EMP001' });
      }
    });
  }

  
}

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { EmployeeService } from '../employees/employee.service';
// import { AccountService } from '../accounts/account.service';
// import { DepartmentService } from '../departments/department.service';

// @Component({
//   selector: 'app-add-employee',
//   templateUrl: './add.component.html'
// })
// export class AddComponent implements OnInit {
//   employeeForm: FormGroup;
//   accounts: any[] = [];
//   departments: any[] = [];
//   

//   constructor(
//     private fb: FormBuilder,
//     private employeeService: EmployeeService,
//     private accountService: AccountService,
//     private departmentService: DepartmentService,
//     private router: Router
//   ) {
//     this.employeeForm = this.fb.group({
//       employeeId: ['', Validators.required],
//       accountId: ['', Validators.required],
//       position: ['', Validators.required],
//       departmentId: ['', Validators.required],
//       hireDate: ['', Validators.required],
//       status: ['Active', Validators.required],
//     });
//   }

//   ngOnInit(): void {
//     this.accountService.getAll().subscribe(data => this.accounts = data);
//     this.departmentService.getAll().subscribe(data => this.departments = data);
//   }

//   onSubmit() {
//     if (this.employeeForm.valid) {
//       this.employeeService.create(this.employeeForm.value).subscribe({
//         next: () => this.router.navigate(['/admin/employees']),
//         error: (err) => console.error(err)
//       });
//     }
//   }
// }
