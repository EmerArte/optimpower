import { Component, OnInit, HostListener } from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';
import { CoolTheme } from 'src/app/components/custom.theme.echart';
import { OperacionalService } from '../operacional.service';
import { DataWellService } from '../data/shared.data.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-campo',
  templateUrl: './campo.component.html',
  styleUrls: ['./campo.component.css'],
})
export class CampoComponent implements OnInit {
  dataDelMes: any;
  lineChartsData: any;
  pozosActivoData: any;
  date:any;

  constructor(
    private operacionalService: OperacionalService,
    private dataForm: DataWellService,
    public loadingService: LoadingService
  ) {
    this.resizeChart();
  }

  // Util & theme
  theme!: string | ThemeOption;
  coolTheme = CoolTheme;
  currentDate: Date = new Date();
  cargando: boolean = true;


  // day consume
  bbls: any;
  water: any;
  gasCons: any;
  gas: any;
  // Information cards
  totalbbls: any = '';
  totalWater: any = '';
  totalmscf: any = '';
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
  pTitle: string = 'Wells active';
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
        offsetCenter: ['0%', '75%'],
      },
      detail: {
        offsetCenter: ['0%', '100%'],
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

  lYAxisName1 = 'Oil';
  lYAxisName2 = 'Water';
  lYAxisName3 = 'Gas';

  ngOnInit(): void {
    this.buildPozosChart();
    this.buildFieldProductionChart();
    this.buildLine1Chart();
    this.buildLine2Chart();
    this.buildLine3Chart();
    this.buildtreemapChart();
    this.buildAceleradorChart();
    this.dataForm.getData.subscribe({
      next: (item) => {
        if (item) {
          const rangoFechas = this.parsearFechasParaConsulta(
            item.fechaInicial,
            item.fechaFinal
          );
          this.operacionalService
            .consultaDashboarCampo(item.campos.FIELD_ID, rangoFechas)
            .subscribe({
              next: (res: any) => {
                const legendProductionData:any = [];
                const fSeriesData:any = [];
                
                
                this.lineChartsData = JSON.parse(res.field_vol);
                this.date = this.lineChartsData.TIMESTAMP ? Object.values(this.lineChartsData.TIMESTAMP).slice(-1).toString() : "N/A";
                
                this.pozosActivoData = JSON.parse(res.status);
                const total = JSON.parse(res.total);
                const wellsum = JSON.parse(res.well_sum);

                console.log(this.lineChartsData );
                
                
                Object.values(wellsum.OIL_VOL).forEach((value:any, index:number)=>{
                  if(value!=null){
                    const obj = {
                      value: value,
                      name: wellsum.WELL_NAME[index]
                    }
                    legendProductionData.push(wellsum.WELL_NAME[index]);
                    fSeriesData.push(obj);
                  }
                })
                
                this.water = this.formatNumberES(Number(Object.values(this.lineChartsData.WATER_RATE).slice(-1).toString()));
                this.bbls = this.formatNumberES(Number(Object.values(this.lineChartsData.OIL_RATE).slice(-1).toString()));
                this.gas = this.formatNumberES(Number(Object.values(this.lineChartsData.GAS_RATE).slice(-1).toString()));
                this.gasCons = this.formatNumberES(Number(Object.values(this.lineChartsData.GAS_TOTAL_CONSUMPTION).slice(-1).toString()));
                this.liquid =  this.formatNumberES(Number(Object.values(this.lineChartsData.LIQUID_RATE).slice(-1).toString()));
                this.waterInyection =  this.formatNumberES(Number(Object.values(this.lineChartsData.INJ_WATER_VOLUME).slice(-1).toString()));

                
                this.totalWater = this.formatNumberES(Object.values(total.WATER_RATE)[0]);
                this.totalmscf =   this.formatNumberES(Object.values(total.GAS_TOTAL_CONSUMPTION)[0]);
                this.totalbbls =   this.formatNumberES(Object.values(total.OIL_RATE)[0]);

                const pozosStatus: any = [];
                const mix: any = [];
                const treemapYaxisData: any = [];
                const treemapSeriesData: any = [];
                let cont = 0;
                const colors = ["#0400FF", "#00B919","#8900B9","#B90000", "#AC6600", "#494949"]
                Object.values(this.pozosActivoData.GROUP).forEach(
                  (value: any, index: any) => {
                    if (value === 'WELL_TYPE') {
                      if(this.pozosActivoData.TYPE[index] === "OIL"){
                        const obj = {
                          type: value,
                          count: this.pozosActivoData.COUNT[index],
                          status: this.pozosActivoData.CATEGORY[index],
                        };
                        pozosStatus.push(this.pozosActivoData.CATEGORY[index]);
                        mix.push(obj);
                      }
                    }else{
                      if(this.pozosActivoData.TYPE[index] === "OIL"){
                        treemapYaxisData.push(this.pozosActivoData.CATEGORY[index]);
                        
                        const obj = {
                          value : this.pozosActivoData.COUNT[index],
                          itemStyle: {
                            color: colors[cont],
                          },
                        }
                        cont = cont + 1;
                        treemapSeriesData.push(obj)
                      }
                    }
                  }
                );
                
                const gaugeTota = Number(res.potential);
                console.log(total);
                
                console.log(Number(Object.values(total.OIL_RATE)[0]));
                
                this.gaugeData[0].value = Number(Number(this.bbls * 100 / gaugeTota).toFixed(2));
                this.updateAceleradorChart = {
                  title: {
                    subtext: "Expected: "+ this.formatNumberES(gaugeTota) + "\n" + "Current: " + this.bbls,
                  },
                  series : [{
                    min: 0,
                    max: 150,
                    data: this.gaugeData
                  }
                  ]
                }
                
                this.updateFieldProductionChart = {
                  legend:{
                    data: legendProductionData
                  },
                  series : [{
                    data: fSeriesData
                  }]
                }

                this.updateTreemapChart = { 
                  yAxis: {
                  data: treemapYaxisData,
                },
                series: [
                  {
                    data: treemapSeriesData
                  },
                ],
                }
                if (mix) {
                  this.updatePozosChart = {
                    yAxis: {
                      data: [mix[1].status,mix[0].status, mix[2].status],
                    },
                    series: [
                      {
                        data: [
                          {
                            value: mix[1].count,
                            itemStyle: {
                              color: '#008000',
                            },
                          },
                          {
                            value: mix[0].count,
                            itemStyle: {
                              color: '#a90000',
                            },
                          },
                          {
                            value: mix[2].count,
                            itemStyle: {
                              color: '#808080',
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
          color: '#eae305',
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
        top: '20%',
        bottom: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        name: this.pYAxisName,
        nameLocation: 'middle',
        nameGap: 20,
      },
      yAxis: {
        type: 'category',
        axisLabel: {
          inside: true,
          rotate: 0
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
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#eae305',
        },
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        left: 10,
        top: 20,
        bottom: 20,
        data: []
      },
      toolbox: {
        show:false
      },
      series: [
        {
          name: 'Production',
          type: 'pie',
          center: ['65%', '50%'],
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          labelLine: {
            length: 3
          },
          label: {
            fontSize: 10,
            formatter: '{b|{b}\n}{per|{c}}  ',
            borderWidth: 1,
            borderRadius: 4,
            rich: {
              a: {
                color: '#FFFFFF',
                fontSize: 10,
                lineHeight: 10,
                align: 'center'
              },
              b: {
                color: '#FFFFFF',
                
                fontSize: 12,
                fontWeight: 'bold',
                lineHeight: 10
              },
              per: {
                color: '#FFFFFF',
                fontSize: 10,
                backgroundColor: '#4C5058',
                align: 'center',
                padding: [3, 4],
                borderRadius: 4
              }
            }
          },
          data: [],
          emphasis: {
            label: {
              show: true,
              fontSize: 30,
              fontWeight: 'bold',
            },
          }
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
          color: '#eae305',
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
          lineStyle:{
            width: 4
          },
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
          lineStyle:{
            width: 4
          },
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
          lineStyle:{
            width: 4
          },
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
        text: 'Production: actual vs expected',
        subtext: 'Expected: N/A',
        subtextStyle: {
          fontSize: 12,
          fontStyle: 'italic'
        },
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#eae305',
        },
      },
      series: [
        {
          type: 'gauge',
          anchor: {
            show: true,
            showAbove: true,
            size: 14,
            itemStyle: {
              color: '#FAC858',
              
            },
          },
          pointer: {
            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
            width: 5,
            length: '90%',
            offsetCenter: [0, '20%'],
          },
          splitLine: {
            show: false,
            distance: 5,
            lineStyle:{
              color: "#ffff"
            },
            length: 5
          },
          axisTick: {
            show: false,
          },
          progress: {
            show: true,
            overlap: true,
            roundCap: true,
            width: 10,
          },
          axisLine: {
            roundCap: true,
            lineStyle:{
              width: 10,
            }
          },
          axisLabel: {
            show: true,
            distance: 5,
            color: "#FFFF"
          },
          data: this.gaugeData,
          title: {
            lineHeight: 56,
            fontSize: 14,
            color: '#FFFFFF',
          },
          detail: {
            position: 'bottom',
            width: 80,
            height: 10,
            fontSize: 14,
            color: '#FFFFFF',
            backgroundColor: 'inherit',
            borderRadius: 1,
            formatter: '{value}%',
          },
        },
      ],
    };
  }

  buildtreemapChart() {

    this.treemapChart = {
      title: {
        top: '0%',
        left: '2%',
        textStyle: {
          overflow: 'breakAll',
          fontSize: 12,
          fontWeight: 'bold',
          color: '#eae305',
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
        top: '20%',
        bottom: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        name: this.pYAxisName,
        nameLocation: 'middle',
        nameGap: 20,
      },
      yAxis: {
        type: 'category',
        axisLabel: {
          inside: true,
          rotate: 0
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
  formatNumberES = (n:any, d=0) => {
    n=new Intl.NumberFormat("es-ES").format((n).toFixed(d))
    if (d>0) {
        // Obtenemos la cantidad de decimales que tiene el numero
        const decimals=n.indexOf(",")>-1 ? n.length-1-n.indexOf(",") : 0;
 
        // añadimos los ceros necesios al numero
        n = (decimals==0) ? n+","+"0".repeat(d) : n+"0".repeat(d-decimals);
    }
    return n;
}
}
