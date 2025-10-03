import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { RequestService } from '@app/_services/request.service';
import { EmployeeService } from '@app/_services/employee.service';
import { AlertService } from '@app/_services';

@Component({
  templateUrl: './edit-request.component.html'
})
export class EditRequestComponent implements OnInit {
  requestForm!: FormGroup;
  id!: number;
  loading = false;
  submitting = false;
  employees: any[] = [];
  types = ['Equipment', 'Supplies', 'Other'];
  statuses = ['Pending', 'Approved', 'Rejected'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private employeeService: EmployeeService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
  const idParam = this.route.snapshot.paramMap.get('id');

  // Convert to number safely
  this.id = idParam ? Number(idParam) : 0;

  if (!this.id) {
    this.alertService.error('Invalid request ID');
    this.router.navigateByUrl('/admin/requests');
    return;
  }

  this.buildForm();
  this.loadData();
}


  buildForm() {
    this.requestForm = this.fb.group({
      type: ['', Validators.required],
      employeeId: ['', Validators.required],
      items: this.fb.array([]),
      status: ['', Validators.required]
    });
  }

  get items(): FormArray {
    return this.requestForm.get('items') as FormArray;
  }

  addItem(item: any = { name: '', quantity: 1 }) {
    this.items.push(
      this.fb.group({
        name: [item.name, Validators.required],
        quantity: [item.quantity, [Validators.required, Validators.min(1)]]
      })
    );
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  loadData() {
    this.loading = true;

    this.employeeService.getAll().pipe(first()).subscribe({
      next: (employees) => {
        this.employees = employees;

        this.requestService.getById(this.id).pipe(first()).subscribe({
          next: (request) => {
            this.requestForm.patchValue({
              type: request.type,
              employeeId: request.employeeId,
              status: request.status
            });

            // Parse items (in DB it's probably JSON string)
            const parsedItems =
              typeof request.items === 'string' ? JSON.parse(request.items) : request.items;

            parsedItems.forEach((item: any) => this.addItem(item));

            this.loading = false;
          },
          error: (err) => {
            this.alertService.error('Failed to load request');
            console.error(err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.alertService.error('Failed to load employees');
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const updated = {
      ...this.requestForm.value,
      items: JSON.stringify(this.requestForm.value.items) // serialize for backend
    };

    this.requestService.update(this.id, updated)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Request updated successfully', { keepAfterRouteChange: true });
          this.router.navigateByUrl('/admin/requests');
        },
        error: (error) => {
          this.alertService.error(error);
          this.submitting = false;
        }
      });
  }
}
