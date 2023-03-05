import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { Claim, ClaimType, Expense } from 'src/app/models/claim.model';
import { Employee } from 'src/app/models/employee.model';
import { HrManagementService } from '../../hr-management.service';
import { CreateLeaveComponent } from '../create-leave/create-leave.component';

@Component({
  selector: 'app-create-claim',
  templateUrl: './create-claim.component.html',
  styleUrls: ['./create-claim.component.scss']
})
export class CreateClaimComponent {
  claimTypes: ClaimType[] = [];
  expenseTypes: any[] = [{
    label: 'Hotel',
    value: 'HOTEL'
  },
  {
    label: 'Car Rental',
    value: 'CAR RENTAL'
  },
  {
    label: 'Food',
    value: 'FOOD'
  }
    ,
  {
    label: 'Ticket',
    value: 'TICKET'
  }

  ];
  employees: Employee[] = [];
  form!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<CreateLeaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: HrManagementService,
    private fb: FormBuilder
  ) {
    this.service.getEmployees().subscribe((res: any) => {
      this.employees = res.data;
    });
  }

  ngOnInit(): void {
    this.prepageForm(this.data);
  }

  prepageForm(data: Claim) {
    this.form = this.fb.group({
      id: [{ value: data.id, disabled: data.id }],
      date: [{ value: data.date, disabled: data.id }, Validators.required],
      description: [{ value: data.description, disabled: data.id }, Validators.required],
      employeeDTO: [{ value: data.employeeDTO, disabled: data.id }, [Validators.required]],
      expenseClaimDetailDTOList: new FormArray([])
    });
    (data.expenseClaimDetailDTOList || []).forEach((expense: Expense) => {
      this.addExpense(expense);
    });
    if (!data.id) {
      this.addExpense({} as Expense);
    }
  }

  addNewExpense() {
    this.addExpense({} as Expense);
  }

  addExpense(data: Expense) {
    const expenseDetails = this.form.controls['expenseClaimDetailDTOList'] as FormArray;
    expenseDetails.push(
      this.fb.group({
        date: [{ value: data.date, disabled: data.id }, Validators.required],
        description: [{ value: data.description, disabled: data.id }, Validators.required],
        total: [{ value: data.total, disabled: data.id }, Validators.required],
        type: [{ value: data.type, disabled: data.id }, Validators.required]
      })
    );
  }

  getExpensesForm() {
    return this.form.controls['expenseClaimDetailDTOList'] as FormArray;
  }

  removeExpense(index: number) {
    const expenseDetails = this.form.controls['expenseClaimDetailDTOList'] as FormArray;
    expenseDetails.removeAt(index);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
