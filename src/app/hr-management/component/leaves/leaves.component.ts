import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as d3 from 'd3';
import { forkJoin } from 'rxjs';
import { Employee } from 'src/app/models/employee.model';
import { Leave } from 'src/app/models/leave.model';
import { HrManagementService } from '../../hr-management.service';
import { CreateLeaveComponent } from '../create-leave/create-leave.component';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent {

  private data: any[] = [];

  private svg: any;
  private margin = 50;
  private width = 375 - (this.margin * 2);
  private height = 275 - (this.margin * 2);

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(data: any[]): void {
    // Create the X-axis band scale
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map(d => d.LeaveType))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-30)")
      .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
      .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d: any) => x(d.LeaveType))
      .attr("y", (d: any) => y(d.Count))
      .attr("width", x.bandwidth())
      .attr("height", (d: any) => this.height - y(d.Count))
      .attr("fill", "#3f51b5");
  }

  leaves: Leave[] = [];
  employees: Employee[] = [];
  form!: FormGroup;
  constructor(public dialog: MatDialog,
    private fb: FormBuilder,
    private hrService: HrManagementService) { }

  ngOnInit() {
    this.prepageForm();
    this.getData();
  }

  search() {
    this.hrService.getLeaves(this.form.value).subscribe((res: any) => {
      this.leaves = res.data;
    });
  }

  prepageForm() {
    this.form = this.fb.group({
      id: [null],
      from: new FormControl<Date | null>(null),
      to: new FormControl<Date | null>(null),
    });
  }

  getData() {
    forkJoin(
      {
        employees: this.hrService.getEmployees(),
        leaveTypes: this.hrService.getLeaves(this.form.value),
        chartData: this.hrService.getLeavesByType()
      }
    ).subscribe((res: any) => {
      this.employees = res['employees'].data;
      this.leaves = res['leaveTypes'].data;
      this.parseChartData(res['chartData'].data);
    });
  }

  parseChartData(data: any) {
    Object.getOwnPropertyNames(data).forEach((property: string) => {
      this.data.push(
        { "LeaveType": property, "Count": data[property], "Released": "2011" },
      );
    });

    this.createSvg();
    this.drawBars(this.data);
  }

  addLeaves(leave: Leave) {
    this.hrService.addLeave(leave).subscribe((res: any) => {
      this.getData();
    });
  }

  openDialog(leave: Leave): void {
    const dialogRef = this.dialog.open(CreateLeaveComponent, {
      data: leave,
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.addLeaves(result)
      }
    });
  }

  createLeave() {
    this.openDialog({} as Leave);
  }

}
