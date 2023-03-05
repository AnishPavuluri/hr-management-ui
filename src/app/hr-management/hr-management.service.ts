import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { of, tap } from 'rxjs';
import { Claim } from '../models/claim.model';
import { Employee } from '../models/employee.model';
import { Leave } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class HrManagementService {
  baseUrl: string = 'http://localhost:8080/';
  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getEmployees() {
    return this.http.get(this.baseUrl + 'employee/list');
  }

  getDepartments() {
    return this.http.get(this.baseUrl + 'department/list');
  }

  getLeaveTypes() {
    return this.http.get(this.baseUrl + '/leaveType/list');
  }

  getLeavesByType() {
    return this.http.get(this.baseUrl + '/leave/byType');
  }

  getClaimsByType() {
    return this.http.get(this.baseUrl + 'expense/claimByType');
  }


  getClaims(payload: any) {
    let url = '?';
    if (payload.id) {
      url = url + 'empId=' + payload.id;
    }
    return this.http.get(this.baseUrl + 'expense/list' + url);
  }

  getClaimTypes() {
    return of({
      data: [
        {
          label: 'Hotel Expense',
          value: 1
        },
        {
          label: 'Car Rental Expense',
          value: 2
        },
      ]
    });
  }

  updateEmployee(employee: Employee) {
    return this.http.post(this.baseUrl + 'employee/create', employee).pipe(
      tap((res: any) => {
        if (res.statusCode === 200) {
          this.toastr.success(`Employee has been ${employee.id ? "Updated" : 'Created'} successsfully`, 'Success');
        }
      })
    );
  }

  getLeaves(payload: any) {
    let url = '?';
    if (payload.id) {
      url = url + 'empId=' + payload.id;
    }
    if (payload.from) {
      url = url + '&from=' + moment(payload.from).format('DD-MM-yyyy');
    }
    if (payload.to) {
      url = url + '&to=' + moment(payload.to).format('DD-MM-yyyy');
    }
    return this.http.get(this.baseUrl + 'leave/list' + url);
  }

  addLeave(leave: Leave) {
    return this.http.post(this.baseUrl + 'leave/create', leave).pipe(
      tap((res: any) => {
        if (res.statusCode === 200) {
          this.toastr.success('Leave has been created successsfully', 'Success');
        }
      })
    );
  }

  addClaim(claim: Claim) {
    return this.http.post(this.baseUrl + 'expense/create', claim).pipe(
      tap((res: any) => {
        if (res.statusCode === 200) {
          this.toastr.success('Claim has been created successsfully', 'Success');
        }
      })
    );
  }
}
