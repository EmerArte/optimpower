import { Component,OnInit,HostListener } from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';
import { CoolTheme } from 'src/app/components/custom.theme.echart';

@Component({
  selector: 'app-campo',
  templateUrl: './campo.component.html',
  styleUrls: ['./campo.component.css']
})
export class CampoComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.resizeChart();
  }


  // Util & theme
  theme!: string | ThemeOption;
  coolTheme = CoolTheme;
  currentDate: Date = new Date();
  cargando: boolean = true;

  // Information cards 
  bbls: string = "";
  strategic: string = "";
  tactical: string = "";
  totalWater: string = "";
  mscf: string = "";
  waterInyection: string = "";
  gasConsume: string = "";

  // Pozos chart
  pozosChartInstance: any;
  pozosChart: EChartsOption = {};
  updatePozosChart: any;
  initPozosChart = {
    renderer: 'svg'
  }
  // Pozos info
  pTitle: string = "Wells active, inactive, abandoned";
  pXAxisOptions = ['Active', 'Abandoned', 'Inactive'];
  pYAxisName: string = "Well count";
  pSeriesData = [120, 200, 150, 80, 70, 110, 130];

  // Field chart
  fieldProductionChartInstance:any;
  fieldProductionChart: EChartsOption = {};
  updateFieldProductionChart: any;
  initFieldProductionChart = {
    renderer: 'svg',
  }
  //Field info
  fTitle: string = "Field production"
  fSeriesData = [
    { value: 1048, name: 'HUI-002' },
    { value: 735, name: 'RIV-001' },
    { value: 580, name: 'HUI-001' },
    { value: 484, name: 'RIV-002' },
    { value: 300, name: ' HUI-003' }
  ]

  // Line charts
  lineOneChartInstance:any;
  line1Chart: EChartsOption = {};
  updateLine1Chart: any;
  initLine1Chart = {
    renderer: 'svg',
  }

  lineTwoChartInstance:any;
  line2Chart: EChartsOption = {};
  updateLine2Chart: any;
  initLine2Chart = {
    renderer: 'svg',
  }

  lineThreeChartInstance:any;
  line3Chart: EChartsOption = {};
  updateLine3Chart: any;
  initLine3Chart = {
    renderer: 'svg',
  }

  // Data
  lXAxisOptions = ['2008', '2010', '2012']
  lSeriesData = ['1000', '2000', '3000']
  lYAxisFormatter = "{value} mil"
  lYAxisName1 = "Crudo"
  lYAxisName2 = "Water"
  lYAxisName3 = "Gas"

  ngOnInit(): void {
    this.buildPozosChart();
    this.buildFieldProductionChart();
    this.buildLine1Chart();
    this.buildLine2Chart();
    this.buildLine3Chart();
  }

  buildPozosChart(){
    this.pozosChart.title = {
      left: 'center',
      text: this.pTitle,
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
      data: this.pXAxisOptions
    },
    this.pozosChart.yAxis = {
      type: 'value',
      name: this.pYAxisName,
    },
    this.pozosChart.series = [
      {
        data: this.pSeriesData,
        type: 'bar'
      }
    ]
  }

  buildFieldProductionChart(){
    this.fieldProductionChart.title = {
      text: this.fTitle,
      left: 'center'
    },
    this.fieldProductionChart.tooltip = {
      trigger: 'item'
    },
    this.fieldProductionChart.grid = {
      left: '5%',
      right: '5%',
      bottom: '5%',
      containLabel: true,
    };
    this.fieldProductionChart.legend = {
      top: '8%',
      left: 'center'
    },
    this.fieldProductionChart.series = [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        data: this.fSeriesData,
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
      }
    ]
  }

  buildLine1Chart(){
    this.line1Chart.xAxis = {
      type: 'category',
      data: this.lXAxisOptions
    },
    this.line1Chart.grid = {
      left: '5%',
      right: '5%',
      bottom: '5%',
      containLabel: true,
    },
    this.line1Chart.yAxis = {
      name: this.lYAxisName1,
      type: 'value',
      nameLocation: 'middle',
      axisLabel: {
        formatter: this.lYAxisFormatter,
      },
    },
    this.line1Chart.series = [
      {
        data: this.lSeriesData,
        type: 'line'
      }
    ]
  }

  buildLine2Chart(){
    this.line2Chart.xAxis = {
      type: 'category',
      data: this.lXAxisOptions
    },
    this.line2Chart.grid = {
      left: '5%',
      right: '5%',
      bottom: '5%',
      containLabel: true,
    }
    this.line2Chart.yAxis = {
      name: this.lYAxisName2,
      type: 'value',
      nameLocation: 'middle',
      axisLabel: {
        formatter: this.lYAxisFormatter,
      }
    },
    this.line2Chart.series = [
      {
        data: this.lSeriesData,
        type: 'line'
      }
    ]
  }

  buildLine3Chart(){
    this.line3Chart.xAxis = {
      type: 'category',
      data: this.lXAxisOptions
    },
    this.line3Chart.grid = {
      left: '5%',
      right: '5%',
      bottom: '5%',
      containLabel: true,
    },
    this.line3Chart.yAxis = {
      name: this.lYAxisName3,
      type: 'value',
      nameLocation: 'middle',
      axisLabel: {
        formatter: this.lYAxisFormatter,
      }
    },
    this.line3Chart.series = [
      {
        data: this.lSeriesData,
        type: 'line'
      }
    ]
  }
  resizeChart() {
    if(this.pozosChartInstance){
      this.pozosChartInstance.resize();
    }
    if(this.fieldProductionChartInstance){
      this.fieldProductionChartInstance.resize();
    }
    if(this.lineOneChartInstance){
      this.lineOneChartInstance.resize();
    }
    if(this.lineTwoChartInstance){
      this.lineTwoChartInstance.resize();
    }
    if(this.lineThreeChartInstance){
      this.lineThreeChartInstance.resize();
    }

  }
  onPozosGraficaInit(e: any) {
    this.pozosChartInstance = e;
  }
  onFieldfieldProductionChartInit(e: any) {
    this.fieldProductionChartInstance = e;
  }
  
  onLineOneChartInit(e: any) {
    this.lineOneChartInstance = e;
  }
  
  onLineTwoChartInit(e: any) {
    this.lineTwoChartInstance = e;
  }
  
  onLineThreeChartInit(e: any) {
    this.lineThreeChartInstance = e;
  }

  //Utils
  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date: Date) {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  }

}
