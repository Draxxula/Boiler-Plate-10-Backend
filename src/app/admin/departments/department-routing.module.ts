import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentComponent } from './department.component';
import { AddDepartmentComponent } from './add-department.component';
import { EditDepartmentComponent } from './edit-department.component';

const routes: Routes = [
  { path: '', component: DepartmentComponent },
  { path: 'create', component: AddDepartmentComponent },
  { path: 'edit/:id', component: EditDepartmentComponent },
  { path: '**', redirectTo: '' } // Redirect unknown paths to the main component
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule {}
