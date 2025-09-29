import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

@Component({ templateUrl: 'edit.component.html' })
export class EditComponent implements OnInit {
  form!: FormGroup;
  id!: string;
  loading = false;
  submitting = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.form = this.fb.group({
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      status: ['', Validators.required],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    this.loading = true;
    this.accountService.getById(this.id)
      .pipe(first())
      .subscribe(x => {
        this.form.patchValue(x);
        this.loading = false;
      });
  }

  get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        if (this.form.invalid) return;

        this.submitting = true;

        // Build updateData explicitly from form controls to ensure status is included
        const updateData = {
        title: this.form.value.title,
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        email: this.form.value.email,
        role: this.form.value.role,
        status: this.form.value.status // <-- Add this explicitly
        };

        console.log('Submitting update:', updateData); // Debugging

        this.accountService.update(this.id, updateData)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Account updated', { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/admin/accounts');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            });
    }
}
