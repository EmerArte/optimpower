import { Component, HostListener, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { CoolTheme } from '../../custom.theme.echart';

@Component({
  selector: 'app-strategical',
  templateUrl: './strategical.component.html',
  styleUrls: ['./strategical.component.css']
})
export class StrategicalComponent implements OnInit {


  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.resizeChart();
  }
  resizeChart() {
      if(this.pozosChartInstance){
        this.pozosChartInstance.resize();
      }
  }
  ngOnInit(): void {
    this.buildPozosChart();
  }

  fechaAcual: Date = new Date();
  cargando: boolean = true;
  coolTheme = CoolTheme;
  pSeriesData = [120, 200, 150];

  pozosChartInstance: any;
  pozosChart: EChartsOption = {};
  updatePozosChart: any;
  initPozosChart = {
    renderer: 'svg'
  }


  buildPozosChart(){
    this.pozosChart.title = {
      left: 'center',
      text: "Active - Inactive - Close Wells",
    }
    this.pozosChart.tooltip = {
      trigger: 'axis',
    }
    this.pozosChart.grid = {
      left: '5%',
      right: '5%',
      bottom: '5%',
      containLabel: true,
    }
    this.pozosChart.xAxis = {
      type: 'category',
      data: ["Activo", "Inactivo", "Close"]
    },
    this.pozosChart.yAxis = {
      type: 'value',
      name: "nombre",
    },
    this.pozosChart.series = [
      {
        data: this.pSeriesData,
        type: 'bar'
      }
    ]
  }

  onPozosGraficaInit(e: any) {
    this.pozosChartInstance = e;
  }

  formatDate(date: Date) {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  }
  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

}
