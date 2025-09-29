import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';

import { EmployeeComponent } from './employee.component';
import { AddEmployeeComponent } from './add-employee.component';
import { EditEmployeeComponent } from './edit-employee.component';
import { EmployeeRoutingModule } from './employee-routing.module';

@NgModule({
  declarations: [EmployeeComponent, AddEmployeeComponent, EditEmployeeComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    EmployeeRoutingModule,
    ReactiveFormsModule
  ]
})
export class EmployeeModule {}