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
  dataDelMes:any;

  constructor(private operacionalService: OperacionalService) {
    operacionalService.dailyReport().subscribe({
      next: (data: any) => {
        this.dataDelMes = JSON.parse(data);
        console.log(this.dataDelMes);
        this.totalWater = Object.values(this.dataDelMes.month.WATER).reduce((a:number, b:any) => a + b, 0).toFixed(1) as string;
        this.mscf =  Object.values(this.dataDelMes.month.GAS).reduce((a:number, b:any) => a + b, 0).toFixed(1) as string;
        this.bbls =  Object.values(this.dataDelMes.month.OIL).reduce((a:number, b:any) => a + b, 0).toFixed(1) as string;
        this.numeroSlaActivos = Object.values(
          this.dataDelMes.sla.SLA_COUNT
        ).reduce((a: any, b: any) => a + b, 0);

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
    const gaugeData = [
      {
        value: 60,
        name: 'Good',
        title: {
          offsetCenter: ['-40%', '80%']
        },
        detail: {
          offsetCenter: ['-40%', '95%']
        }
      },
      {
        value: 80,
        name: 'Better',
        title: {
          
          offsetCenter: ['40%', '80%']
        },
        detail: {
          offsetCenter: ['40%', '95%']
        }
      }
    ];
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
          anchor: {
            show: true,
            showAbove: true,
            size: 12,
            itemStyle: {
              color: '#FAC858'
            }
          },
          pointer: {
            icon:
              'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
            width: 8,
            length: '80%',
            offsetCenter: [0, '8%']
          },
          // splitLine: {
          //   length: 8,
          //   lineStyle: {
          //     width: 2,
          //     color: '#999'
          //   }
          // },
          progress: {
            show: true,
            overlap: true,
            roundCap: true,
          },
          axisLine: {
            roundCap: true
          },
          data: gaugeData,
          title: {
            fontSize: 12,
            position: ['12%', '20%'],
            color: '#FFFFFF'
          },
          detail: {
            width: 15,
            height: 12,
            fontSize: 12,
            color: '#FFFFFF',
            backgroundColor: 'inherit',
            borderRadius: 3,
            formatter: '{value}'
          }
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
