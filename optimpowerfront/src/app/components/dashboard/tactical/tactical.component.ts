import { Component, HostListener, OnInit } from '@angular/core';
import { CoolTheme } from '../../custom.theme.echart';
import { EChartsOption } from 'echarts';
var ROOT_PATH = 'https://echarts.apache.org/examples';

@Component({
  selector: 'app-tactical',
  templateUrl: './tactical.component.html',
  styleUrls: ['./tactical.component.scss']
})
export class TacticalComponent implements OnInit{

  cargando: boolean = true;

  coolTheme = CoolTheme;
  graficaQdpNpdDInstance:any;
  graficaQdpNpdD: EChartsOption = {};
  updateGraficaQdpNpdD: any;


  graficaNpEurDInstance:any;
  graficaNpEur: EChartsOption = {};
  updateGraficaNpEur: any;

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.resizeChart();
  }
  resizeChart() {
      if(this.graficaQdpNpdDInstance){
        this.graficaQdpNpdDInstance.resize();
      }
      if(this.graficaNpEurDInstance){
        this.graficaNpEurDInstance.resize();
      }
  }
  ngOnInit(): void {
    this.buildGraficaQdpNpdD();
    this.builGraficaNpEur();
  }
  buildGraficaQdpNpdD() {
    console.log("");
    
    this.graficaQdpNpdD = {
      title: {
        text: 'QdD-NpdD'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['QdD', 'NpdD']
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        nameGap: 30,
        type: 'category',
        name: 'tdD',
        nameLocation: 'middle',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        axisLabel : {
          formatter: '{value}'
        },
        nameGap: 30,
        name: 'qDd - NpDd',
        nameLocation: 'middle',
        type: 'value'
      },
      series: [
        {
          name: 'QdD',
          type: 'line',
          stack: 'Total',
          smooth: true,
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: 'NpdD',
          type: 'line',
          stack: 'Total',
          smooth: true,
          data: [220, 182, 191, 234, 290, 330, 310]
        }
      ]
    };
  }
  builGraficaNpEur() {
    this.graficaNpEur = {
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        containLabel: true
      },
      title: {
        text: 'Np - Eur',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: '10%'
      },
      series: [
        {
          name: 'Data',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: 'Np' },
            { value: 735, name: 'Eur' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
}
  onGraficaQdpNpdD(e: any) {
    this.graficaQdpNpdDInstance = e;
  }
  onGraficaNpEur(e: any) {
    this.graficaNpEurDInstance = e;
  }
}
