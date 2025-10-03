// src/app/admin/accounts/add.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

@Component({ templateUrl: 'add.component.html' })
export class AddComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitting = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      status: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        console.log("Submitting form data:", this.form.value);

        if (this.form.invalid) return;

        this.submitting = true;

        const { confirmPassword, ...account } = this.form.value;

        this.accountService.create(this.form.value)
        .pipe(first())
        .subscribe({
            next: () => {
            this.alertService.success('Account created', { keepAfterRouteChange: true });
            this.router.navigateByUrl('/admin/accounts');
            },
            error: error => {
            this.alertService.error(error);
            this.submitting = false;
            }
        });
    }
}
