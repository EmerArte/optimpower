import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoolTheme } from '../../custom.theme.echart';
import { EChartsOption } from 'echarts';
import { TacticalService } from './tactical.service';
import { LoadingService } from 'src/app/services/loading.service';
import { OperacionalService } from '../operacional/operacional.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-tactical',
  templateUrl: './tactical.component.html',
  styleUrls: ['./tactical.component.scss'],
})
export class TacticalComponent implements OnInit, OnDestroy {
  cargando: boolean = true;
  backEndSuscribe: any;
  wellList: any[] = [];
  tacticalForm: any;

  coolTheme = CoolTheme;
  graficaQdpNpdDInstance: any;
  graficaQdpNpdD: EChartsOption = {};
  updateGraficaQdpNpdD: any;
  initgraficaQdpNpdD = {
    renderer: 'svg',
  };

  graficaQdpNpdDInstance2: any;
  graficaQdpNpdD2: EChartsOption = {};
  updateGraficaQdpNpdD2: any;
  initgraficaQdpNpdD2 = {
    renderer: 'svg',
  };

  tipo: any;
  lastDate: any;
  lastB: any;
  lastDi: any;
  EUR: any;
  NP:any;
  Tesp: any;

  graficaNpEurDInstance: any;
  graficaNpEur: EChartsOption = {};
  updateGraficaNpEur: any;
  constructor(
    private tacticalService: TacticalService,
    public loading: LoadingService,
    private operationalService: OperacionalService,
    private form: FormBuilder
  ) {
    this.tacticalForm = this.form.group({
      posos: [this.wellList, Validators.required],
      limEco: [null, Validators.required],
    });
  }
  ngOnDestroy(): void {
    this.backEndSuscribe.unsubscribe();
  }
  resizeChart() {
    if (this.graficaQdpNpdDInstance) {
      this.graficaQdpNpdDInstance.resize();
    }
    if (this.graficaNpEurDInstance) {
      this.graficaNpEurDInstance.resize();
    }
  }
  ngOnInit(): void {
    this.buildGraficaQdpNpdD();
    this.builGraficaNpEur();
    this.buildGraficaQdpNpdD2();
    this.consultaBackEnd();
    this.loading.setLoading(true);
    this.tacticalForm.valueChanges.subscribe({
      next: (res: any) => {
        this.tacticalService.getDeclinacion(res.posos.WELL_ID).subscribe({
          next: (declinacion: any) => {
            const tactical = JSON.parse(declinacion);
            console.log(tactical);

            this.lastB = Object.values(tactical.COEF.B).slice(-1)[0];
            this.lastDi = Object.values(tactical.COEF.DI).slice(-1)[0];
            this.lastDate = Object.values(tactical.EUR.VOLUME_DATE).slice(
              -1
            )[0];
            this.EUR = Object.values(tactical.COEF.EUR).slice(-1)[0];
            this.Tesp = Object.values(tactical.COEF.T_ESP).slice(-1)[0];
            this.NP = Object.values(tactical.COEF.NP).slice(-1)[0];
            const fechas = Object.values(tactical.EUR.VOLUME_DATE);
            const dataSerieCurva1 = Object.values(tactical.EUR.OIL_VOLUME);
            const dataSerieCurva2 = Object.values(tactical.EUR.QD);
            const dataSerieEur = Object.values(tactical.EUR.EUR);
            this.tipo = Object.values(tactical.COEF.TYPE)[0];
            this.updateGraficaQdpNpdD = {
              legend:{
                data:['QD','OIL VOLUME']
              },
              title: {
                text: Object.values(tactical.COEF.TYPE)[0] + ' Declination',
              },
              xAxis: {
                data: fechas,
              },
              series: [
                {
                   name: 'QD',
                  data: dataSerieCurva2,
                },
                {
                   name: 'OIL VOLUME',
                  data: dataSerieCurva1,
                },
              ],
            };
            this.updateGraficaQdpNpdD2 = {
              legend:{
                data:['QD','OIL VOLUME','EUR']
              },
              title: {
                text: Object.values(tactical.COEF.TYPE)[0] + ' Declination',
              },
              xAxis: {
                data: fechas,
              },
              series: [
                {
                   name: 'QD',
                  data: dataSerieCurva2,
                },
                {
                   name: 'OIL VOLUME',
                  data: dataSerieCurva1,
                },
                {
                  name: 'EUR',
                  data: dataSerieEur,
               },
              ],
            };
            this.updateGraficaNpEur = {
              series: [
                {
                  data: [
                    {
                      value: Object.values(tactical.COEF.NP).slice(-1)[0],
                      name: 'Np',
                    },
                    {
                      value: Object.values(tactical.COEF.EUR).slice(-1)[0],
                      name: 'Eur',
                    },
                  ],
                },
              ],
            };
          },
        });
      },
    });
  }

  consultaBackEnd() {
    this.loading.setLoading(true);
    this.backEndSuscribe = this.operationalService
      .consultaListaDePosos()
      .subscribe({
        next: (value: any) => {
          this.wellList = value.filter(
            (value: { WELL_TYPE: string }) => value.WELL_TYPE == 'OIL'
          );
          this.tacticalForm.patchValue({
            posos: this.wellList[0],
            limEco: 30,
          });
        },
      });
  }

  buildGraficaQdpNpdD() {
    this.graficaQdpNpdD = {
      title: {
        text: 'Declination',
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '10%',
        top: '10%',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        nameLocation: 'middle',
        name: 'Date',
      },
      legend: {
        data: [],
        top: '5%',
        left: '1%',
      },
      yAxis: {
        type: 'value',
        name: 'BOPD',
        nameLocation: 'middle',
      },
      series: [
        {
          type: 'line',
          stack: 'Total',
          showSymbol: false,
          color: '#B600FF',
          lineStyle: {
            width: 3,
            type: 'dashed',
          },
        },
        {
          type: 'line',
          stack: 'total',
          showSymbol: false,
          color: '#0C00FF',
          lineStyle: {
            width: 3,
          },
        },
      ],
    };
  }
  buildGraficaQdpNpdD2() {
    this.graficaQdpNpdD2 = {
      title: {
        text: 'Declination',
        textStyle: {
          fontSize: 11
        }
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '10%',
        top: '10%',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        nameLocation: 'middle',
        name: 'Date',
      },
      legend: {
        data: [],
        top: '5%',
        left: '1%',
      },
      yAxis: {
        type: 'value',
        name: 'BOPD',
        nameLocation: 'middle',
      },
      series: [
        {
          type: 'line',
          stack: 'Total',
          showSymbol: false,
          color: 'orange',
          lineStyle: {
            width: 2
          },
        },
        {
          type: 'line',
          stack: 'total',
          showSymbol: false,
          color: 'blue',
          lineStyle: {
            width: 2,
          },
        },
        {
          type: 'line',
          stack: 'total',
          showSymbol: false,
          color: 'green',
          lineStyle: {
            width: 2,
          },
        },
      ],
    };
  }
  builGraficaNpEur() {
    this.graficaNpEur = {
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        containLabel: true,
      },
      title: {
        text: 'Np - Eur',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: '10%',
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
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }
  onGraficaQdpNpdD(e: any) {
    this.graficaQdpNpdDInstance = e;
  }
  onGraficaQdpNpdD2(e: any) {
    this.graficaQdpNpdDInstance2 = e;
  }
  onGraficaNpEur(e: any) {
    this.graficaNpEurDInstance = e;
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
