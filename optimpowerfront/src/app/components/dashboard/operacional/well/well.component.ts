import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { OperacionalService } from '../operacional.service';
import { EChartsOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';
import { CoolTheme } from 'src/app/components/custom.theme.echart';
import { DataWellService } from '../data/shared.data.service';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { Util } from 'src/utils/util';
import { TacticalService } from '../../tactical/tactical.service';
@Component({
  selector: 'app-well',
  templateUrl: './well.component.html',
  styleUrls: ['./well.component.css'],
})
export class WellComponent implements OnInit, OnDestroy {
  pozo!: string;
  listaPozos: any[] = [];
  frecuency: any;
  levantamiento: any;
  graficaUnoInstance: any;
  graficaDosInstance: any;
  graficaUno: EChartsOption = {};
  updateOptionsGraficauno: any;
  initOptionGraficaUno = {
    renderer: 'svg',
  };

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

  graficaDos: EChartsOption = {};
  updateOptionsGraficaDos: any;
  initOptionGraficaDos = {
    renderer: 'svg',
  };

  dataGeneral: any = {};

  crudo: string = '';
  fluido: string = '';
  agua: string = '';
  gas: string = '';
  campo: string = '';
  campoId!: number;
  diferida: any;
  pozoId!: number;
  estadoPozo: string = '';
  gor: any;
  bsw: any;
  lastDate:any;

  accrudo: string = '';
  acgas: string = '';
  acagua: any = '';

  theme!: string | ThemeOption;
  coolTheme = CoolTheme;
  fechaAcual: Date = new Date();

  rangoFechas!: string;
  dataForm: any;

  subscription!: Subscription;
  tacticalSub!: Subscription;
  constructor(
    private service: OperacionalService,
    private wellDataService: DataWellService,
    public loadingService: LoadingService,
    private tacticalService: TacticalService
  ) {
    this.resizeChart();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.tacticalSub.unsubscribe();
  }
  ngOnInit(): void {
    this.construirGrafica1();
    this.construirGrafica2();
    this.buildAceleradorChart();
    this.subscription = this.wellDataService.getData.subscribe({
      next: (item: any) => {
        if (item != null) {
          if (item.campos) {
            this.dataForm = item;
            this.campoId = this.dataForm?.campos.FIELD_ID;
            this.campo = this.dataForm?.campos.FIELD_NAME;
            this.pozo = this.dataForm?.posos.WELL_NAME;
            this.pozoId = this.dataForm?.posos.WELL_ID;
            this.estadoPozo = this.dataForm?.posos.WELL_STATUS;
            this.levantamiento = this.dataForm?.posos.PRODUCTION_METHOD;
            
            this.lastDate = this.dataForm.fechaFinal;
            this.rangoFechas = this.parsearFechasParaConsulta(
              this.dataForm.fechaInicial,
              this.dataForm.fechaFinal
            );
            
            this.service
              .consultaVolumenOfWellByDate(this.pozoId, this.rangoFechas)
              .subscribe({
                next: (res: any) => {
                  this.dataGeneral = JSON.parse(res);
                  
                  if(this.levantamiento === "Mecanico"){
                    this.frecuency = this.dataGeneral.operational.length
                    ? this.dataGeneral.operational[0].FREQUENCY + ' SPMK'
                    : 'N/A';
                  }else if(this.levantamiento === "ESP"){
                    this.frecuency = this.dataGeneral.operational.length
                    ? this.dataGeneral.operational[0].FREQUENCY + ' Hz'
                    : 'N/A';
                  }else if(this.levantamiento === "PCP"){
                    this.frecuency = this.dataGeneral.operational.length
                    ? this.dataGeneral.operational[0].FREQUENCY + ' Rpm'
                    : 'N/A';
                  }else{
                    this.frecuency = this.dataGeneral.operational.length
                    ? this.dataGeneral.operational[0].FREQUENCY
                    : 'N/A';
                  }
                  this.crudo = this.dataGeneral.kpi[0].last.toFixed(2)
                    ? this.dataGeneral.kpi[0].last.toFixed(2)
                    : 'N/A';
                  this.diferida = this.dataGeneral.opt
                    ? parseFloat(Object.values(this.dataGeneral.opt.DEFERRED_OIL).slice(-1).toString()).toFixed(2)
                    : 'N/A';

                  this.fluido = this.dataGeneral.kpi[2].last.toFixed(2)
                    ? this.dataGeneral.kpi[2].last.toFixed(2)
                    : 'N/A';
                  this.agua = this.dataGeneral.kpi[1].last.toFixed(2)
                    ? this.dataGeneral.kpi[1].last.toFixed(2)
                    : 'N/A';
                  this.gas = this.dataGeneral.kpi[3].last.toFixed(2)
                    ? this.dataGeneral.kpi[3].last.toFixed(2)
                    : 'N/A';

                  this.acagua = Util.formatNumberES(Object.values(this.dataGeneral.opt.WATER_VOLUME).reduce((suma:any, a) => suma + a, 0));
                  this.accrudo = Util.formatNumberES(Object.values(this.dataGeneral.opt.OIL_VOLUME).reduce((suma:any, a) => suma + a, 0));
                  this.acgas = Util.formatNumberES(Object.values(this.dataGeneral.opt.GAS_VOLUME).reduce((suma:any, a) => suma + a, 0));

                  if (this.dataGeneral.operational) {
                    this.gor =
                      this.dataGeneral.operational.length > 0
                        ? this.dataGeneral.operational[0].GAS_OIL_RATIO.toFixed(
                            2
                          )
                        : 'N/A';

                    this.bsw =
                      this.dataGeneral.operational.length > 0
                        ? (
                            this.dataGeneral.operational[0].WATER_CUT_PERCENT *
                            100
                          ).toFixed(2)
                        : 'N/A';
                  } else {
                    this.gor = 'N/A';
                    this.bsw = 'N/A';
                  }

                  this.updateOptionsGraficauno = {
                    xAxis: {
                      data: Object.values(this.dataGeneral.opt.VOLUME_DATE),
                    },
                    series: [
                      {
                        data: Object.values(this.dataGeneral.opt.GAS_VOLUME),
                      },
                      {
                        data: Object.values(this.dataGeneral.opt.OIL_VOLUME),
                      },
                      {
                        data: Object.values(this.dataGeneral.opt.WATER_VOLUME),
                      },
                      {
                        data: Object.values(this.dataGeneral.opt.LIQUID_VOLUME),
                      },
                    ],
                  };
                  this.updateOptionsGraficaDos = {
                    xAxis: {
                      data: Object.values(this.dataGeneral.opt.VOLUME_DATE),
                    },
                    legend: {
                      data: [this.pozo],
                    },
                    series: [
                      {
                        name: this.pozo,
                        data: Object.values(this.dataGeneral.opt.OIL_VOLUME),
                      },
                    ],
                  };
                  this.tacticalSub = this.tacticalService.getDeclinacion(this.pozoId, 5).subscribe({
                    next:(val:any)=>{
                      let EUR_EXPECTED;
                      val.EUR.filter((a:any) => {
                        const fechas = new Date(a.VOLUME_DATE);
                        if((fechas.getFullYear() === this.fechaAcual.getFullYear()) &&  (fechas.getMonth() === this.fechaAcual.getMonth())){
                          EUR_EXPECTED =  a.EUR;
                        }
                      });
                      const gaugeExpected = EUR_EXPECTED ? Number(EUR_EXPECTED) : 0;
                      this.gaugeData[0].value = Number((Number(this.crudo) * 100 / gaugeExpected).toFixed(2));
                      this.updateAceleradorChart = {
                        title: {
                          subtext: "Expected: "+ Util.formatNumberES(gaugeExpected) + "\n" + "Current: " + Util.formatNumberES(Number(this.crudo),2)
                        },
                        series : [{
                          min: 0,
                          max: 150,
                          data: this.gaugeData
                        }
                        ]
                      }
                    }
                  });
                },
                
              });
              
            
          }
        }
      },
    });
    
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

  construirGrafica1() {
    this.graficaUno.title = {
      top: '1%',
      left: '2%',
      text: 'Gas(MMSFC), OilRate(BOPD), Water(BWPD) & Fluid(BFPD) by time',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#eae305',
      },
    };

    (this.graficaUno.tooltip = {
      trigger: 'axis',
    }),
      (this.graficaUno.legend = {
        left: '2%',
        top: '4%',
        data: ['Gas(MMSFC)', 'OilRate average (BOPD)', 'Water(BWPD)', 'Fluid(BFPD)'],
      }),
      (this.graficaUno.grid = {
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      }),
      (this.graficaUno.toolbox = {
        top: '8%',
        right: '5%',
        feature: {
          dataZoom: {
            yAxisIndex: 'all',
          },
          restore: {},
          saveAsImage: {},
        },
      }),
      (this.graficaUno.yAxis = {
        type: 'value',
      });
    this.graficaUno.xAxis = {
      type: 'category',
      boundaryGap: false,
      data: [],
    };
    this.graficaUno.series = [
      {
        name: 'Gas(MMSFC)',
        color: '#000000',
        type: 'line',
        data: [],
      },
      {
        name: 'OilRate average (BOPD)',
        color: '#00fff8',
        type: 'line',
        data: [],
      },
      {
        name: 'Water(BWPD)',
        color: '#4fb3ff',
        type: 'line',
        data: [],
      },
      {
        name: 'Fluid(BFPD)',
        color: '#f100ff',
        type: 'line',
        data: [],
      },
    ];
  }

  construirGrafica2() {
    this.graficaDos.title = {
      top: '1%',
      left: '2%',
      text: 'OilRate by register of date and Well',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#eae305',
      },
    };
    this.graficaDos.tooltip = {
      trigger: 'axis',
    };
    this.graficaDos.toolbox = {
      top: '12%',
      right: '5%',
      feature: {
        dataZoom: {
          yAxisIndex: 'all',
        },
        restore: {},
        saveAsImage: {},
      },
    };
    this.graficaDos.legend = {
      left: '2%',
      top: '5%',
    };
    this.graficaDos.xAxis = {
      type: 'category',
      boundaryGap: false,
    };
    this.graficaDos.yAxis = {
      type: 'value',
    };
    (this.graficaDos.grid = {
      left: '5%',
      right: '5%',
      bottom: '5%',
      containLabel: true,
    }),
      (this.graficaDos.series = [
        {
          type: 'line',
          symbol: 'none',
          sampling: 'lttb',
          itemStyle: {
            color: 'rgb(255, 70, 131)',
          },
          areaStyle: {},
        },
      ]);
  }
  buildAceleradorChart() {
   
    this.aceleradorChart = {
      title: {
        top: '0%',
        left: '2%',
        text: 'Production: actual vs expected',
        subtext: 'Expected: N/A',
        subtextStyle: {
          fontSize: 9,
          fontStyle: 'italic'
        },
        textStyle: {
          fontSize: 12,
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
            size: 12,
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
            width: 40,
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
  onAceleradorChartInit(e: any) {
    this.aceleradorChartInstance = e;
  }
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

  onGraficaUnoInit(e: any) {
    this.graficaUnoInstance = e;
  }
  onGraficaDosInit(e: any) {
    this.graficaDosInstance = e;
  }
  resizeChart() {
    if (this.graficaUnoInstance) {
      this.graficaUnoInstance.resize();
    }
    if (this.graficaDosInstance) {
      this.graficaDosInstance.resize();
    }
  }
}
