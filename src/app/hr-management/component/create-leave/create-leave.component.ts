import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { Employee } from 'src/app/models/employee.model';
import { Leave, LeaveType } from 'src/app/models/leave.model';
import { HrManagementService } from '../../hr-management.service';

@Component({
  selector: 'app-create-leave',
  templateUrl: './create-leave.component.html',
  styleUrls: ['./create-leave.component.scss']
})
export class CreateLeaveComponent {
  leaveTypes: LeaveType[] = [];
  employees: Employee[] = [];
  form!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<CreateLeaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: HrManagementService,
    private fb: FormBuilder
  ) {
    this.service.getLeaveTypes().subscribe((res: any) => {
      this.leaveTypes = res.data;
    });

    forkJoin(
      {
        employees: this.service.getEmployees(),
        leaveTypes: this.service.getLeaveTypes(),
      }
    ).subscribe((res: any) => {
      this.employees = res['employees'].data;
      this.leaveTypes = res['leaveTypes'].data;
    });
  }

  ngOnInit(): void {
    this.prepageForm();
  }

  prepageForm() {
    this.form = this.fb.group({
      employeeDTO: [null, Validators.required],
      leaveTypeDTO: [null, Validators.required],
      from: new FormControl<Date | null>(null, Validators.required),
      to: new FormControl<Date | null>(null, Validators.required),
      numberOfDays: [null, [Validators.required]],
      note: [null, Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
