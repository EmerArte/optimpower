import { Component, OnInit, HostListener } from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';
import { CoolTheme } from 'src/app/components/custom.theme.echart';
import { OperacionalService } from '../operacional.service';

@Component({
  selector: 'app-campo',
  templateUrl: './campo.component.html',
  styleUrls: ['./campo.component.css'],
})
export class CampoComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resizeChart();
  }
  numeroSlaActivos!: any;

  constructor(private operacionalService: OperacionalService) {
    operacionalService.dailyReport().subscribe({
      next: (data: any) => {
        console.log(JSON.parse(data));
        this.numeroSlaActivos = Object.values(
          JSON.parse(data).sla.SLA_COUNT
        ).reduce((a: any, b: any) => a + b, 0);
        console.log(this.numeroSlaActivos);

        this.updatePozosChart = {
          series: [
            {
              data: [
                {
                  value: this.numeroSlaActivos,
                  itemStyle: {
                    color: '#008000'
                  }
                },
                {
                  value: 3,
                  itemStyle: {
                    color: '#a90000'
                  }
                },
                {
                  value: 12,
                  itemStyle: {
                    color: '#808080'
                  }
                },],
            }
          ],
        };
      },
    });
  }

  // Util & theme
  theme!: string | ThemeOption;
  coolTheme = CoolTheme;
  currentDate: Date = new Date();
  cargando: boolean = true;

  // Information cards
  bbls: string = '';
  strategic: string = '';
  tactical: string = '';
  totalWater: string = '';
  mscf: string = '';
  waterInyection: string = '';
  gasConsume: string = '';

  // Pozos chart
  pozosChartInstance: any;
  pozosChart: EChartsOption = {};
  updatePozosChart: any;
  initPozosChart = {
    renderer: 'svg',
  };
  // Pozos info
  pTitle: string = 'Wells active, inactive, abandoned';
  pXAxisOptions = ['Active', 'Abandoned', 'Inactive'];
  pYAxisName: string = 'Well count';
  pSeriesData = [120, 200, 150];

  // Field chart
  fieldProductionChartInstance: any;
  fieldProductionChart: EChartsOption = {};
  updateFieldProductionChart: any;
  initFieldProductionChart = {
    renderer: 'svg',
  };
  //Field info
  fTitle: string = 'Field production';
  fSeriesData = [
    { value: 1048, name: 'HUI-002' },
    { value: 735, name: 'RIV-001' },
    { value: 580, name: 'HUI-001' },
    { value: 484, name: 'RIV-002' },
    { value: 300, name: ' HUI-003' },
  ];

  //Acelerador
  aceleradorChartInstance: any;
  aceleradorChart: EChartsOption ={};
  updateAceleradorChart: any;
  initAceleradorChart= {
    renderer: 'svg'
  }



  // Line charts
  lineOneChartInstance: any;
  line1Chart: EChartsOption = {};
  updateLine1Chart: any;
  initLine1Chart = {
    renderer: 'svg',
  };

  lineTwoChartInstance: any;
  line2Chart: EChartsOption = {};
  updateLine2Chart: any;
  initLine2Chart = {
    renderer: 'svg',
  };

  lineThreeChartInstance: any;
  line3Chart: EChartsOption = {};
  updateLine3Chart: any;
  initLine3Chart = {
    renderer: 'svg',
  };

  // Data
  lXAxisOptions = ['2008', '2010', '2012'];
  lSeriesData = ['1000', '2000', '3000'];
  lYAxisFormatter = '{value} mil';
  lYAxisName1 = 'Crudo';
  lYAxisName2 = 'Water';
  lYAxisName3 = 'Gas';

  ngOnInit(): void {
    this.buildPozosChart();
    this.buildFieldProductionChart();
    this.buildLine1Chart();
    this.buildLine2Chart();
    this.buildLine3Chart();
    this.buildAceleradorChart();
  }

  buildPozosChart() {
    this.pozosChart = {
      title: {
        top: '0%',
        left: '2%',
        textStyle:{
          fontSize: 12,
          fontWeight: 'bold',
          color: '#FFFFFF'
        },
        text: this.pTitle
      },
      tooltip : {
        trigger: 'axis',
      },
      grid : {
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      xAxis : {
        type: 'category',
        data: this.pXAxisOptions,
      },
      yAxis : {
        type: 'value',
        name: this.pYAxisName,
      },
      series : [
        {
          data: [],
          type: 'bar',
        },
      ]
    }
  }

  buildFieldProductionChart() {
    this.fieldProductionChart = {
      title: {
        text: this.fTitle,
        top: '0%',
        left: '2%',
        textStyle:{
          fontSize: 12,
          fontWeight: 'bold',
          color: '#FFFFFF'
        },
      },
      tooltip: {
          trigger: 'item',
      },
      grid : {
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      legend: {
        left: '2%',
        top: '8%',
      },
      toolbox : {
        top: '14%',
        right: '5%',
        feature: {
          dataZoom: {
            yAxisIndex: 'all',
          },
          restore: {},
          saveAsImage: {},
        },
      },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            data: this.fSeriesData,
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
          },
        ]
    };
  }

  buildLine1Chart() {
    this.line1Chart= {
      title : {
        top: '0%',
          left: '2%',
          textStyle:{
            fontSize: 12,
            fontWeight: 'bold',
            color: '#FFFFFF'
          },
      },
      xAxis : {
        type: 'category',
        data: this.lXAxisOptions,
      },
      grid : {
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      yAxis : {
        name: this.lYAxisName1,
        type: 'value',
        nameLocation: 'middle',
        axisLabel: {
          formatter: this.lYAxisFormatter,
        }
      },
      series : [
        {
          data: this.lSeriesData,
          type: 'line',
        },
      ]
    }
  }

  buildLine2Chart() {
    this.line2Chart = {
      title : {
        top: '0%',
          left: '2%',
          textStyle:{
            fontSize: 12,
            fontWeight: 'bold',
            color: '#FFFFFF'
          },
      },
      xAxis : {
        type: 'category',
        data: this.lXAxisOptions,
      },
      grid : {
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      yAxis : {
        name: this.lYAxisName2,
        type: 'value',
        nameLocation: 'middle',
        axisLabel: {
          formatter: this.lYAxisFormatter,
        }
      },
      series : [
        {
          data: this.lSeriesData,
          type: 'line',
        },
      ]
    }
  }

  buildLine3Chart() {
    this.line3Chart = {
      title : {
        top: '0%',
          left: '2%',
          textStyle:{
            fontSize: 12,
            fontWeight: 'bold',
            color: '#FFFFFF'
          },
      },
      xAxis : {
        type: 'category',
        data: this.lXAxisOptions,
      },
      grid : {
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      yAxis : {
        name: this.lYAxisName3,
        type: 'value',
        nameLocation: 'middle',
        axisLabel: {
          formatter: this.lYAxisFormatter,
        }
      },
      series : [
        {
          data: this.lSeriesData,
          type: 'line',
        },
      ]
    }
  }

  buildAceleradorChart(){
    this.aceleradorChart = {
      title:{
      top: '0%',
      left: '2%',
      text: 'Titulo grafica',
      textStyle:{
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF'
      }
      },
      series: [
      {
        type: 'gauge',
        color: '#36aee4',
        progress: {
          show: true,
          width: 12
        },
        axisLine: {
          lineStyle: {
            width: 12
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          length: 8,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        axisLabel: {
          distance: 12,
          color: '#999',
          fontSize: 12
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 15,
          itemStyle: {
            borderWidth: 5
          }
        },
        title: {
          fontSize: 12,
          show: false
        },
        detail: {
          valueAnimation: true,
          fontSize: 18,
          color: '#36aee4',
          offsetCenter: [0, '70%']
        },
        data: [
          {
            value: 70
          }
        ]
      }
    ]
  }
  }

  resizeChart() {
    if (this.pozosChartInstance) {
      this.pozosChartInstance.resize();
    }
    if (this.fieldProductionChartInstance) {
      this.fieldProductionChartInstance.resize();
    }
    if (this.lineOneChartInstance) {
      this.lineOneChartInstance.resize();
    }
    if (this.lineTwoChartInstance) {
      this.lineTwoChartInstance.resize();
    }
    if (this.lineThreeChartInstance) {
      this.lineThreeChartInstance.resize();
    }
    if(this.aceleradorChartInstance){
      this.aceleradorChartInstance.resize();
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
  onAceleradorChartInit(e: any){
    this.aceleradorChartInstance = e;
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
