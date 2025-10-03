// src/app/admin/requests/add-request.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { RequestService, AlertService } from '@app/_services';
import { EmployeeService } from '@app/_services/employee.service';

@Component({ templateUrl: 'add-request.component.html' })
export class AddRequestComponent implements OnInit {
    requestForm!: FormGroup;
    loading = false;
    submitting = false;
    submitted = false;

    employees: any[] = []; // to be loaded from API

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private requestService: RequestService,
    private alertService: AlertService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.requestForm = this.fb.group({
      type: ['', Validators.required],
      employeeId: ['', Validators.required],
      items: this.fb.array([])
    });

    // add one default item
    this.addItem();

    this.loadEmployees();
  }

  // convenience getter
  get f() { return this.requestForm.controls; }

  // items getter
  get items(): FormArray {
    return this.requestForm.get('items') as FormArray;
  }

  addItem() {
    this.items.push(
      this.fb.group({
        name: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]]
      })
    );
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  loadEmployees() {
    this.employeeService.getAll().subscribe({   
      next: (res:any) => {
        this.employees = res;
      },
      error: (err:any) => {
        console.error('Failed to load employees', err);
      }
    });
  }

  onSubmit() {
  this.submitted = true;
  this.alertService.clear();

  console.log("Submitting request data:", this.requestForm.value);

  if (this.requestForm.invalid) return;

  this.submitting = true;

  // copy form values
  let payload = { ...this.requestForm.value };

  // stringify items (backend expects string because of TEXT)
  payload.items = JSON.stringify(payload.items);

  this.requestService.create(payload)
    .pipe(first())
    .subscribe({
      next: () => {
        this.alertService.success('Request created', { keepAfterRouteChange: true });
        this.router.navigateByUrl('/admin/requests');
      },
      error: error => {
        this.alertService.error(error);
        this.submitting = false;
      }
    });
}

}
