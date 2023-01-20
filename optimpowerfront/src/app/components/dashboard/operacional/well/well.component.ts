import {
  Component,
  Input,
  AfterViewInit,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { OperacionalService } from '../operacional.service';
import { EChartsOption, SeriesOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';
import { CoolTheme } from 'src/app/components/custom.theme.echart';
import { DataWellService } from '../data/shared.data.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-well',
  templateUrl: './well.component.html',
  styleUrls: ['./well.component.css'],
})
export class WellComponent implements OnInit, AfterViewInit {
  pozo!: string;
  listaPozos: any[] = [];
  cargando: boolean = true;

  graficaUno: EChartsOption = {};
  updateOptionsGraficauno: any;
  initOptionGraficaUno = {
    renderer: 'svg',
    height: 300
  }
  graficaDos: EChartsOption = {};
  updateOptionsGraficaDos: any;
  initOptionGraficaDos = {
    renderer: 'svg',
    height: 300
  }



  dataGeneral: any = {};

  crudo: string = '';
  fluido: string = '';
  agua: string = '';
  gas: string = '';
  campo: string = '';
  campoId!: number;
  pozoId!: number;
  estadoPozo: string = '';

  theme!: string | ThemeOption;
  coolTheme = CoolTheme;
  fechaAcual: Date = new Date();

  rangoFechas!: string;
  dataForm: any;

  subscription!: Subscription;
  constructor(
    private service: OperacionalService,
    private wellDataService: DataWellService
  ) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.construirGrafica1();
    this.subscription = this.wellDataService.getData.subscribe((item) => {
      if (item != null) {
        if (item.campos) {
          this.dataForm = item;
          this.campoId = this.dataForm?.campos.FIELD_ID;
          this.campo = this.dataForm?.campos.FIELD_NAME;
          this.pozo = this.dataForm?.posos.WELL_NAME;
          this.pozoId = this.dataForm?.posos.WELL_ID;
          this.estadoPozo = this.dataForm?.posos.WELL_STATUS;
          this.rangoFechas = this.parsearFechasParaConsulta(
            this.dataForm.fechaInicial,
            this.dataForm.fechaFinal
          );
          this.service
            .consultaVolumenOfWellByDate(this.pozoId, this.rangoFechas)
            .subscribe((res: any) => {
              this.dataGeneral = JSON.parse(res);
              this.cargando = false;
              this.crudo = Object.values(this.dataGeneral.opt.OIL_VOLUME)
                .slice(-1)
                .toString();
              this.fluido = Object.values(this.dataGeneral.opt.LIQUID_VOLUME)
                .slice(-1)
                .toString();
              this.agua = Object.values(this.dataGeneral.opt.WATER_VOLUME)
                .slice(-1)
                .toString();
              this.gas = Object.values(this.dataGeneral.opt.GAS_VOLUME)
                .slice(-1)
                .toString();
              this.updateOptionsGraficauno = {
                xAxis: {
                  data: Object.values(this.dataGeneral.opt.VOLUME_DATE)
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
                  data: Object.values(this.dataGeneral.opt.VOLUME_DATE)
                },
                series: [
                  {
                    data: Object.values(this.dataGeneral.opt.OIL_VOLUME),
                  }
                ],
              };
              this.construirGrafica2(this.dataGeneral);
            });
        }
      }
    });
  }

  ngAfterViewInit(): void {}

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
      left: 'center',
      text: 'Gas(MMSFC), OilRate average, Water(BWPD) & Fluid(BFPD) by time',
    };
    (this.graficaUno.tooltip = {
      trigger: 'axis',
    }),
      (this.graficaUno.legend = {
        left: '10%',
        top: '6%',
        data: ['Gas(MMSFC)', 'OilRate average', 'Water(BWPD)', 'Fluid(BFPD)'],
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
        stack: 'Total',
        data: [],
      },
      {
        name: 'OilRate average',
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

  construirGrafica2(resJson: any) {
    this.graficaDos.title = {
      left: 'center',
      text: 'OilRate by Registred date and Well',
    };
    this.graficaDos.tooltip = {
      trigger: 'axis',
    };
    this.graficaDos.toolbox = {
      feature: {
        dataZoom: {
          yAxisIndex: 'all',
        },
        restore: {},
        saveAsImage: {},
      },
    };
    this.graficaDos.legend = {
      left: '5%',
      top: '5%',
      data: [this.campo],
    };
    this.graficaDos.xAxis = {
      type: 'category',
      boundaryGap: false,
      data: [],
    };
    this.graficaDos.yAxis = {
      type: 'value',
      boundaryGap: false,
    };
    this.graficaDos.grid = {
      left: '5%',
      right: '5%',
      height: '150px',
    };
    this.graficaDos.series = [
      {
        name: this.campo,
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: 'rgb(255, 70, 131)',
        },
        areaStyle: {},
        data: [],
      },
    ];
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
}
