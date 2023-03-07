import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(public router: Router){

  }

  openDashboard(pageName: string){
    this.router.navigate([`${pageName}`]);
  }

}
