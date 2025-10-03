import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { DepartmentService, AlertService } from '@app/_services';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html'
})
export class EditDepartmentComponent implements OnInit {
  departmentForm!: FormGroup;
  submitting = false;
  submitted = false;
  id!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    // build form
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });

    // load department data
    this.departmentService.getById(this.id)
      .pipe(first())
      .subscribe((dept: any) => {
        this.departmentForm.patchValue(dept);
    });
  }

  // easy getter for form controls
  get f() { return this.departmentForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();

    if (this.departmentForm.invalid) {
      return;
    }

    this.submitting = true;
    this.departmentService.update(this.id, this.departmentForm.value)
        .pipe(first())
        .subscribe({
            next: () => {
            this.alertService.success('Department updated', { keepAfterRouteChange: true });
            this.router.navigate(['/admin/departments']);
            },
            error: (error: any) => {
                this.alertService.error(error);
                this.submitting = false;
            }
        });
  }
}
