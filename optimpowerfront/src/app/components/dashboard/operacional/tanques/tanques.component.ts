import { Component, OnDestroy, OnInit } from '@angular/core';
import { TanksService } from './tanks.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';
import { EChartsOption } from 'echarts';
import { CoolTheme } from 'src/app/components/custom.theme.echart';
import { DataWellService } from '../data/shared.data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tanques',
  templateUrl: './tanques.component.html',
  styleUrls: ['./tanques.component.css'],
})
export class TanquesComponent implements OnInit, OnDestroy {
  surficeLast: any;
  surficeSum: any;

  listaCampos!: any[];
  listaTanques!: any[];

  minDate!: Date;
  maxDate!: Date;
  auxDate!: Date;
  tanksForm: any;

  coolTheme = CoolTheme;
  // Pozos chart
  transRecivoEntregaInstance: any;
  transRecivoEntregaChart: EChartsOption = {};
  uptadeTransRecivoEntrega: any;
  initTransRecivoEntrega = {
    renderer: 'svg',
  };

  pozosChartInstance: any;
  pozosChart: EChartsOption = {};
  updatePozosChart: any;
  initPozosChart = {
    renderer: 'svg',
  };

  produccionTanksInstance: any;
  produccionTanksChart: EChartsOption = {};
  updateProduccionTanks: any;
  initProduccionTanks = {
    renderer: 'svg',
  };

  subscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private tankservice: TanksService,
    public loadingService: LoadingService,
    private dataForm: DataWellService
  ) {
    this.construirFormulario();
  }

  ngOnInit(): void {
    this.buildPozosChart();
    this.buildtransRecivoEntregaChart();
    this.bouildProductChart();
    this.consultaBackEnd();
  }

  construirFormulario() {
    this.tanksForm = this.formBuilder.group({
      fechaInicial: [null, Validators.required],
      fechaFinal: [null, Validators.required],
      campos: [this.listaCampos, Validators.required],
      tanks: [this.listaTanques, Validators.required],
    });
  }
  consultaTanques() {
    this.tankservice.listTanks().subscribe({
      next: (value: any) => {
        this.listaTanques = value;
      },
    });
  }
  //CONECTAR BACKEND
  consultaBackEnd() {
    this.subscription = this.dataForm.getData.subscribe({
      next: (value: any) => {
        if (value) {
          const rangoFechas = this.parsearFechasParaConsulta(
            value.fechaInicial,
            value.fechaFinal
          );
          this.loadingService.setLoading(true);
          this.tankservice.tankInfoBySurface(rangoFechas).subscribe({
            next: (value: any) => {
              if (value != null && value != 1 && value != undefined) {
                console.log(value == 1);
                
                this.surficeLast = JSON.parse(value.surface_last);
                this.surficeSum = JSON.parse(value.surface_sum);
                this.updatePozosChart = {
                  xAxis: {
                    data: [
                      'CAPACITY',
                      'MEASURED WATER VOL.',
                      'RAW VOLUME',
                      '60F VOLUME',
                      'NET BARRELS',
                    ],
                  },
                  series: [
                    {
                      data: [
                        {
                          value: Object.values(this.surficeLast.CAPACITY).slice(
                            -1
                          ),
                        },
                        {
                          value: Object.values(
                            this.surficeLast.MEASURED_WATER_VOLUME
                          ).slice(-1),
                        },
                        {
                          value: Object.values(
                            this.surficeLast.VOLUME_RAW
                          ).slice(-1),
                        },
                        {
                          value: Object.values(
                            this.surficeLast.VOLUME_60F
                          ).slice(-1),
                        },
                        {
                          value: Object.values(
                            this.surficeLast.NET_BARRELS
                          ).slice(-1),
                        },
                      ],
                    },
                  ],
                };

                console.log(this.surficeSum);

                console.log(this.surficeLast);
              }
            },
          });
        }
      },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  //BUILD
  bouildProductChart() {
    this.produccionTanksChart = {
      title: {
        text: 'Tanks production',
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
        data: [],
      },
      toolbox: {
        show: false,
      },
      series: [
        {
          name: 'Production',
          type: 'pie',
          center: ['65%', '50%'],
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          labelLine: {
            length: 3,
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
                align: 'center',
              },
              b: {
                color: '#FFFFFF',

                fontSize: 12,
                fontWeight: 'bold',
                lineHeight: 10,
              },
              per: {
                color: '#FFFFFF',
                fontSize: 10,
                backgroundColor: '#4C5058',
                align: 'center',
                padding: [3, 4],
                borderRadius: 4,
              },
            },
          },
          data: [],
          emphasis: {
            label: {
              show: true,
              fontSize: 30,
              fontWeight: 'bold',
            },
          },
        },
      ],
    };
  }

  buildtransRecivoEntregaChart() {
    this.transRecivoEntregaChart = {
      title: {
        top: '0%',
        left: '2%',
        textStyle: {
          overflow: 'breakAll',
          fontSize: 12,
          fontWeight: 'bold',
          color: '#eae305',
        },
        text: 'Transfer, Reception & Deliver',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
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
        nameLocation: 'end',
        nameGap: 20,
      },
      yAxis: {
        type: 'category',
        axisLabel: {
          inside: true,
          rotate: 0,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },

        z: 10,
        data: [],
      },
      series: [
        {
          data: [],
          type: 'bar',
          barWidth: '50%',
          label: {
            align: 'center',
          },
        },
      ],
    };
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
        text: 'Transfer, Reception & Deliver',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
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
        nameLocation: 'end',
        nameGap: 20,
      },
      yAxis: {
        type: 'category',
        axisLabel: {
          inside: true,
          rotate: 0,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },

        z: 10,
        data: [],
      },
      series: [
        {
          data: [],
          type: 'bar',
          barWidth: '50%',
          label: {
            align: 'center',
          },
        },
      ],
    };
  }

  //INIT
  onPozosGraficaInit(e: any) {
    this.pozosChartInstance = e;
  }
  onTransRecivoEntregaInit(e: any) {
    this.pozosChartInstance = e;
  }
  onProduccionTanksInit(e: any) {
    this.pozosChartInstance = e;
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
