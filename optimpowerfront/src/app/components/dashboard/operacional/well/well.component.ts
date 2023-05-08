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
  constructor(
    private service: OperacionalService,
    private wellDataService: DataWellService,
    public loadingService: LoadingService
  ) {
    this.resizeChart();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.construirGrafica1();
    this.construirGrafica2();
    this.loadingService.setLoading(true);
    this.subscription = this.wellDataService.getData.subscribe({
      next: (item: any) => {
        if (item != null) {
          if (item.campos) {
            this.dataForm = item;
            console.log(this.dataForm);
            
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
        top: '7%',
        data: ['Gas(MMSFC)', 'OilRate average (BOPD)', 'Water(BWPD)', 'Fluid(BFPD)'],
      }),
      (this.graficaUno.grid = {
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      }),
      (this.graficaUno.toolbox = {
        top: '7%',
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
        stack: 'Total',
        data: [],
      },
      {
        name: 'OilRate average (BOPD)',
        color: '#00fff8',
        type: 'line',
        stack: 'Total',
        data: [],
      },
      {
        name: 'Water(BWPD)',
        color: '#4fb3ff',
        type: 'line',
        stack: 'Total',
        data: [],
      },
      {
        name: 'Fluid(BFPD)',
        color: '#f100ff',
        type: 'line',
        stack: 'Total',
        data: [],
      },
    ];
  }

  construirGrafica2() {
    this.graficaDos.title = {
      top: '1%',
      left: '2%',
      text: 'OilRate by Registred date and Well',
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
      top: '10%',
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
      top: '10%',
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
