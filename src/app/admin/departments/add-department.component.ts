import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentService } from '../../_services/department.service';
import { AlertService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html'
})
export class AddDepartmentComponent {
  departmentForm: FormGroup;
  submitting = false;
  submitted = false;


  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  get f() { return this.departmentForm.controls; }

  onSubmit() {
          this.submitted = true;
          this.alertService.clear();
  
          console.log("Submitting form data:", this.departmentForm.value);
  
          if (this.departmentForm.invalid) return;
  
          this.submitting = true;
  
          //const { confirmPassword, ...account } = this.departmentForm.value;
  
          this.departmentService.create(this.departmentForm.value)
          .pipe(first())
          .subscribe({
              next: () => {
              this.alertService.success('Department created', { keepAfterRouteChange: true });
              this.router.navigateByUrl('/admin/departments');
              },
              error: error => {
              this.alertService.error(error);
              this.submitting = false;
              }
          });
      }
}
