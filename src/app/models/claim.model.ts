import { Employee } from "./employee.model";

export interface ClaimType {
    id: number;
    name: string;
}

export interface Claim {
    id: number;
    date: string;
    description: string;
    total: number;
    employeeDTO: Employee;
    expenseClaimDetailDTOList: Expense[];
    status: string;
}

export interface ExpenseType {
    id: number;
    name: string;
}

export interface Expense {
    id: number;
    date: TimeRanges;
    description: string;
    type: ExpenseType;
    total: number;
}


