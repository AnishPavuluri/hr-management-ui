import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrManagementComponent } from './hr-management.component';
import { EmployeesComponent } from './component/employees/employees.component';
import { CreateEmployeeComponent } from './component/create-employee/create-employee.component';
import { HrManagementRoutingModule } from './hr-management-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { LeavesComponent } from './component/leaves/leaves.component';
import { CreateLeaveComponent } from './component/create-leave/create-leave.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ClaimsComponent } from './component/claims/claims.component';
import { CreateClaimComponent } from './component/create-claim/create-claim.component';
@NgModule({
  declarations: [
    HrManagementComponent,
    EmployeesComponent,
    CreateEmployeeComponent,
    LeavesComponent,
    CreateLeaveComponent,
    ClaimsComponent,
    CreateClaimComponent
  ],
  imports: [
    CommonModule,
    HrManagementRoutingModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class HrManagementModule { }
