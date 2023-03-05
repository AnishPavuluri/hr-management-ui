import { Employee } from "./employee.model";

export interface Leave {
  id: number;
  from: string;
  to: string;
  numberOfDays: number;
  note: string;
  leaveTypeDTO: LeaveType;
  employeeDTO: Employee;
}

export interface LeaveType {
  id: number;
  name: string;
}

