import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestComponent } from './request.component';
import { RequestRoutingModule } from './request-routing.module';
import { AddRequestComponent } from './add-request.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditRequestComponent } from './edit-request.component';

@NgModule({
  declarations: [
    RequestComponent,
    AddRequestComponent,
    EditRequestComponent
  ],
  imports: [
    CommonModule,
    RequestRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RequestModule {}
