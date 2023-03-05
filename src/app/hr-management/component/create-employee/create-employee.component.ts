import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from 'src/app/models/employee.model';
import { HrManagementService } from '../../hr-management.service';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  departments: any[] = [];
  form!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<CreateEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: HrManagementService,
    private fb: FormBuilder
  ) {
    this.service.getDepartments().subscribe((res: any) => {
      this.departments = res.data;
    });
  }

  ngOnInit(): void {
    this.prepageForm(this.data);
  }
  prepageForm(data: Employee) {
    this.form = this.fb.group({
      id: [data.id],
      name: [data.name, Validators.required],
      departmentId: [data.departmentId, Validators.required],
      email: [data.email, [Validators.required, Validators.email]],
      address: [data.address, Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
