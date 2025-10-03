// src/app/admin/employees/employee.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { EmployeeComponent } from './employee.component';
import { AddEmployeeComponent } from './add-employee.component';
import { EditEmployeeComponent } from './edit-employee.component';
import { TransferEmployeeComponent } from './transfer-employee.component';
import { EmployeeRoutingModule } from './employee-routing.module';

@NgModule({
  declarations: [
    EmployeeComponent,
    AddEmployeeComponent,
    EditEmployeeComponent,
    TransferEmployeeComponent   // ✅ should be here
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    EmployeeRoutingModule
  ]
})
export class EmployeeModule {}
