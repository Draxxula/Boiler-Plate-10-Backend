// src/app/admin/request/request-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestComponent } from './request.component';
import { AddRequestComponent } from './add-request.component';
import { EditRequestComponent } from './edit-request.component';

const routes: Routes = [
  { path: '', component: RequestComponent },
  { path: 'create', component: AddRequestComponent },
  { path: 'edit/:id', component: EditRequestComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule {}
