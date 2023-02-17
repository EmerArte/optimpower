import { Component, OnInit, HostListener } from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';
import { CoolTheme } from 'src/app/components/custom.theme.echart';
import { OperacionalService } from '../operacional.service';
import { LoadingService } from 'src/app/services/loading.service';
import { DataWellService } from '../data/shared.data.service';

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
  dataDelMes: any;

  lineChartsData: any;
  pozosActivoData: any;

  constructor(
    private operacionalService: OperacionalService,
    public loadingService: LoadingService,
    private dataForm: DataWellService
  ) {}

  // Util & theme
  theme!: string | ThemeOption;
  coolTheme = CoolTheme;
  currentDate: Date = new Date();
  cargando: boolean = true;

  // Information cards
  bbls: any = '';
  totalWater: any = '';
  mscf: any = '';
  waterInyection: any = '';
  gasConsume: any = '';
  liquid: any = '';

  // Pozos chart
  pozosChartInstance: any;
  pozosChart: EChartsOption = {};
  updatePozosChart: any;
  initPozosChart = {
    renderer: 'svg',
  };
  // Pozos info
  pTitle: string = 'Wells active, inactive, abandoned';
  pYAxisName: string = 'Well count';

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
  aceleradorChart: EChartsOption = {};
  updateAceleradorChart: any;
  initAceleradorChart = {
    renderer: 'svg',
  };
  gaugeData = [
    {
      value: 0,
      name: 'Current',
      title: {
        offsetCenter: ['-40%', '80%'],
      },
      detail: {
        offsetCenter: ['-40%', '100%'],
      },
    },
    {
      value: 0,
      name: 'Expected',
      title: {
        offsetCenter: ['40%', '80%'],
      },
      detail: {
        offsetCenter: ['40%', '100%'],
      },
    },
  ];

  // Pozos chart
  treemapChartInstance: any;
  treemapChart: EChartsOption = {};
  updateTreemapChart: any;
  initTreemapChart = {
    renderer: 'svg',
  };

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
  lYAxisFormatter = '{value} mil';
  lYAxisName1 = 'Oil';
  lYAxisName2 = 'Water';
  lYAxisName3 = 'Gas';

  ngOnInit(): void {
    this.buildPozosChart();
    this.buildFieldProductionChart();
    this.buildLine1Chart();
    this.buildLine2Chart();
    this.buildLine3Chart();
    this.buildAceleradorChart();
    this.dataForm.getData.subscribe({
      next: (item) => {
        if (item) {
          this.loadingService.setLoading(true);
          const rangoFechas = this.parsearFechasParaConsulta(
            item.fechaInicial,
            item.fechaFinal
          );
          this.operacionalService
            .consultaDashboarCampo(item.campos.FIELD_ID, rangoFechas)
            .subscribe({
              next: (res: any) => {
                this.lineChartsData = JSON.parse(res.field_vol);
                this.pozosActivoData = JSON.parse(res.status);
                const total = JSON.parse(res.total);
                console.log(total);

                this.totalWater = Object.values(total.WATER_RATE)[0];
                this.mscf =  Object.values(total.GAS_RATE)[0];
                this.bbls =  Object.values(total.OIL_RATE)[0];
                this.liquid = Object.values(total.LIQUID_RATE)[0]
                this.waterInyection = Object.values(total.INJ_WATER_VOLUME)[0];

                const pozosStatus: any = [];
                const mix: any = [];
                Object.values(this.pozosActivoData.TYPE).forEach(
                  (value: any, index: any) => {
                    if (value === 'OIL') {
                      const obj = {
                        type: value,
                        count: this.pozosActivoData.COUNT[index],
                        status: this.pozosActivoData.STATUS[index],
                      };
                      pozosStatus.push(this.pozosActivoData.STATUS[index]);
                      mix.push(obj);
                    }
                  }
                );
                this.gaugeData[0].value = this.bbls / 100;
                this.gaugeData[1].value = Number(Object.values(total.INJ_WATER_VOLUME)[0]) / 100;
                this.updateAceleradorChart = {
                  series : [{
                    min: 0,
                    max: 1000,
                    data: this.gaugeData
                  }
                  ]
                }

                if (mix) {
                  this.updatePozosChart = {
                    xAxis: {
                      data: pozosStatus.reverse(),
                    },
                    series: [
                      {
                        data: [
                          {
                            value: mix[2].count,
                            itemStyle: {
                              color: '#008000',
                            },
                          },
                          {
                            value: mix[1].count,
                            itemStyle: {
                              color: '#808080',
                            },
                          },
                          {
                            value: mix[0].count,
                            itemStyle: {
                              color: '#a90000',
                            },
                          },
                        ],
                      },
                    ],
                  };
                }
                if (this.lineChartsData) {
                  this.updateLine1Chart = {
                    xAxis: {
                      data: Object.values(this.lineChartsData.TIMESTAMP),
                    },
                    series: {
                      data: Object.values(this.lineChartsData.OIL_RATE),
                    },
                  };
                  this.updateLine2Chart = {
                    xAxis: {
                      data: Object.values(this.lineChartsData.TIMESTAMP),
                    },
                    series: {
                      data: Object.values(this.lineChartsData.WATER_RATE),
                    },
                  };
                  this.updateLine3Chart = {
                    xAxis: {
                      data: Object.values(this.lineChartsData.TIMESTAMP),
                    },
                    series: {
                      data: Object.values(this.lineChartsData.GAS_RATE),
                    },
                  };
                }
              },
            });
        }
      },
    });
  }

  buildPozosChart() {
    this.pozosChart = {
      title: {
        top: '0%',
        left: '2%',
        textStyle: {
          overflow: 'breakAll',
          fontSize: 12,
          fontWeight: 'bold',
          color: '#FFFFFF',
        },
        text: this.pTitle,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        left: '8%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          inside: true,
          rotate: 90
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
      
        z: 10,
        data: [],
      },
      yAxis: {
        type: 'value',
        name: this.pYAxisName,
        nameLocation: 'end',
        nameGap: 20,
      },
      series: [
        
        {
          data: [],
          type: 'bar',
          barWidth: "50%",
          label: {
            align: 'center'
          }
        },
      ],
    };
  }

  buildFieldProductionChart() {
    this.fieldProductionChart = {
      title: {
        text: this.fTitle,
        top: '0%',
        left: '2%',
        textStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          color: '#FFFFFF',
        },
      },
      tooltip: {
        trigger: 'item',
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      legend: {
        left: '2%',
        top: '8%',
      },
      toolbox: {
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
      ],
    };
  }

  buildLine1Chart() {
    this.line1Chart = {
      title: {
        top: '0%',
        left: '2%',
        textStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          color: '#FFFFFF',
        },
      },
      legend: {
        left: '2%',
        top: '7%',
        data: ['Oil'],
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        name: 'Date',
        nameLocation: 'middle',
        nameTextStyle: {
          color: '#FFFFFF',
        },
        nameGap: 20,
        data: [],
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      toolbox: {
        top: '7%',
        right: '5%',
        feature: {
          dataZoom: {
            yAxisIndex: 'all',
          },
          restore: {},
          saveAsImage: {},
        },
      },
      yAxis: {
        name: this.lYAxisName1,
        type: 'value',
        nameLocation: 'middle',
        nameTextStyle: {
          color: '#FFFFFF',
        },
        nameGap: 30,
      },
      series: [
        {
          name: 'Oil',
          data: [],
          type: 'line',
          color: 'red'
        },
      ],
    };
  }

  buildLine2Chart() {
    this.line2Chart = {
      title: {
        top: '0%',
        left: '2%',
        textStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          color: '#FFFFFF',
        },
      },
      toolbox: {
        top: '7%',
        right: '5%',
        feature: {
          dataZoom: {
            yAxisIndex: 'all',
          },
          restore: {},
          saveAsImage: {},
        },
      },
      legend: {
        left: '2%',
        top: '7%',
        data: ['Water'],
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        nameLocation: 'middle',
        nameTextStyle: {
          color: '#FFFFFF',
        },
        nameGap: 30,
        data: [],
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      yAxis: {
        name: this.lYAxisName2,
        type: 'value',
        nameLocation: 'middle',
        nameTextStyle: {
          color: '#FFFFFF',
        },
        nameGap: 30,
      },
      series: [
        {
          name: 'Water',
          data: [],
          type: 'line',
          color: 'blue'
        },
      ],
    };
  }

  buildLine3Chart() {
    this.line3Chart = {
      title: {
        top: '0%',
        left: '2%',
        textStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          color: '#FFFFFF',
        },
      },
      toolbox: {
        top: '7%',
        right: '5%',
        feature: {
          dataZoom: {
            yAxisIndex: 'all',
          },
          restore: {},
          saveAsImage: {},
        },
      },
      legend: {
        left: '2%',
        top: '7%',
        data: ['Gas'],
      },
      xAxis: {
        type: 'category',
        nameLocation: 'middle',
        nameTextStyle: {
          color: '#FFFFFF',
        },
        nameGap: 30,
        data: [],
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      yAxis: {
        name: this.lYAxisName3,
        type: 'value',
        nameLocation: 'middle',
        nameTextStyle: {
          color: '#FFFFFF',
        },
        nameGap: 30,
      },
      series: [
        {
          name: 'Gas',
          data: [],
          type: 'line',
          color: 'green'
        },
      ],
    };
  }

  buildAceleradorChart() {
   
    this.aceleradorChart = {
      title: {
        top: '0%',
        left: '2%',
        text: 'Production',
        subtext: 'Scaled values x100',
        subtextStyle: {
          fontSize: 9,
          fontStyle: 'italic'
        },
        textStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          color: '#FFFFFF',
        },
      },
      series: [
        {
          type: 'gauge',
          anchor: {
            show: true,
            showAbove: true,
            size: 12,
            itemStyle: {
              color: '#FAC858',
            },
          },
          pointer: {
            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
            width: 8,
            length: '80%',
            offsetCenter: [0, '8%'],
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
            roundCap: true,
          },
          axisLabel: {
            fontSize: 10,
            color: '#FFFFFF',
          },
          data: this.gaugeData,
          title: {
            lineHeight: 56,
            fontSize: 12,
            color: '#FFFFFF',
          },
          detail: {
            width: 40,
            height: 12,
            fontSize: 12,
            color: '#FFFFFF',
            backgroundColor: 'inherit',
            borderRadius: 3,
            formatter: '{value}',
          },
        },
      ],
    };
  }

  buildtreemapChart() {
    this.treemapChart = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'tree',
          id: 0,
          name: 'tree1',
          data: [],
    
          top: '10%',
          left: '8%',
          bottom: '22%',
          right: '20%',
    
          symbolSize: 7,
    
          edgeShape: 'polyline',
          edgeForkPosition: '63%',
          initialTreeDepth: 3,
    
          lineStyle: {
            width: 20,
            color: '#eae305'
          },
    
          label: {
            fontStyle:'normal',
            fontSize: 14,
            fontWeight: 'bold',
            backgroundColor: '#fff',
            position: 'left',
            verticalAlign: 'middle',
            align: 'right'
          },
    
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left'
            }
          },
    
          emphasis: {
            focus: 'descendant'
          },
    
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      ]
    };
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
    if (this.aceleradorChartInstance) {
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
  onAceleradorChartInit(e: any) {
    this.aceleradorChartInstance = e;
  }
  ontreemapChartInit(e: any) {
    this.treemapChartInstance = e;
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
  parsearFechasParaConsulta(fechaInicial: Date, fechaFinal: Date) {
    const dateOne = [
      fechaInicial.getFullYear(),
      this.padTo2Digits(fechaInicial.getMonth() + 1),
      this.padTo2Digits(fechaInicial.getDate()),
    ].join('-');
    const dateTwo = [
      fechaFinal.getFullYear(),
      this.padTo2Digits(fechaFinal.getMonth() + 1),
      this.padTo2Digits(fechaFinal.getDate()),
    ].join('-');
    return [dateOne, dateTwo].join('/');
  }
}
