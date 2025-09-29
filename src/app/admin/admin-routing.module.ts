import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubNavComponent } from './subnav.component';
import { LayoutComponent } from './layout.component';
import { OverviewComponent } from './overview.component';

const accountsModule = () => import('./accounts/accounts.module').then(x => x.AccountsModule);
const employeesModule = () => import('./employees/employee.module').then(x => x.EmployeeModule);
const departmentsModule = () => import('./departments/department.module').then(x => x.DepartmentModule);
const requestModule = () => import('./request/request.module').then(x => x.RequestModule);

const routes: Routes = [
    { path: '', component: SubNavComponent, outlet: 'subnav' },
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: OverviewComponent },
            { path: 'accounts', loadChildren: accountsModule },
            { path: 'employees', loadChildren: () => import('./employees/employee.module').then(m => m.EmployeeModule) },
            { path: 'departments', loadChildren: () => import('./departments/department.module').then(m => m.DepartmentModule) },
            { path: 'requests', loadChildren: () => import('./request/request.module').then(m => m.RequestModule) },
            { path: '', redirectTo: 'accounts', pathMatch: 'full' }
            // { data: { roles: ['Admin'] }}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }