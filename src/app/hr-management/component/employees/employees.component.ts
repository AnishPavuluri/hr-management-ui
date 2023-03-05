import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Employee } from 'src/app/models/employee.model';
import { HrManagementService } from '../../hr-management.service';
import { CreateEmployeeComponent } from '../create-employee/create-employee.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent {
  employees: Employee[] = [];
  constructor(public dialog: MatDialog, private hrService: HrManagementService) { }

  ngOnInit() {
this.getEmployees();
  }

  getEmployees(){
    this.hrService.getEmployees().subscribe((res: any) => {
      this.employees = res.data;
    });
  }

  updateEmployee(employee: Employee) {
    this.hrService.updateEmployee(employee).subscribe((res: any) => {
      this.getEmployees();
    });
  }

  editEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(CreateEmployeeComponent, {
      data: employee,
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result){
        this.updateEmployee(result)
      }
    });
  }

  createEmployee(){
    this.editEmployee({} as Employee);
  }   

}
