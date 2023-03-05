import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as d3 from 'd3';
import { forkJoin } from 'rxjs';
import { Claim } from 'src/app/models/claim.model';
import { Employee } from 'src/app/models/employee.model';
import { Leave } from 'src/app/models/leave.model';
import { HrManagementService } from '../../hr-management.service';
import { CreateClaimComponent } from '../create-claim/create-claim.component';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent {
  private data: any[] = [];

  private svg: any;
  private margin = 50;
  private width = 375 - (this.margin * 2);
  private height = 275 - (this.margin * 2);

  private createSvg(): void {
    this.svg = d3.select("figure#claimChart")
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
      .domain([0, 500])
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

  

  claims: Claim[] = [];
  employees: Employee[] = [];
  form!: FormGroup;
  constructor(public dialog: MatDialog,
    private fb: FormBuilder,
    private hrService: HrManagementService) { }

  ngOnInit() {
    this.prepageForm();
    this.getData();
    this.createSvg();
  }

  search() {
    this.hrService.getClaims(this.form.value).subscribe((res: any) => {
      this.claims = res.data;
    });
  }

  prepageForm() {
    this.form = this.fb.group({
      id: [null],
    });
  }

  getData() {
    forkJoin(
      {
        employees: this.hrService.getEmployees(),
        claims: this.hrService.getClaims(this.form.value),
        claimsByType:this.hrService.getClaimsByType()
      }
    ).subscribe((res: any) => {
      this.employees = res['employees'].data;
      this.claims = res['claims'].data;
      this.parseChartData(res['claimsByType'].data);
    });
  }

  parseChartData(data: any) {
    Object.getOwnPropertyNames(data).forEach((property: string) => {
      this.data.push(
        { "LeaveType": property, "Count": data[property] },
      );
    });    
    this.drawBars(this.data);
  }

  addClaim(claim: Claim) {
    this.hrService.addClaim(claim).subscribe((res: any) => {
      this.getData();
    });
  }

  openDialog(claim: Claim): void {
    const dialogRef = this.dialog.open(CreateClaimComponent, {
      data: claim,
      width: '80%',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result&&!result.id) {
        this.addClaim(result)
      }
    });
  }

  createClaim() {
    this.openDialog({} as Claim);
  }

  viewClaim(claim: Claim) {
    this.openDialog(claim);

  }

}
