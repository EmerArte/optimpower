import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CoolTheme } from '../../custom.theme.echart';
import { EChartsOption } from 'echarts';
import { TacticalService } from './tactical.service';
import { LoadingService } from 'src/app/services/loading.service';
import { OperacionalService } from '../operacional/operacional.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Util } from 'src/utils/util';

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
  ngOnInit(): void {
    this.buildGraficaQdpNpdD();
    this.builGraficaNpEur();
    this.buildGraficaQdpNpdD2();
    this.consultaBackEnd();
    this.tacticalForm.valueChanges.subscribe({
      next: (res: any) => {
        this.tacticalService.getDeclinacion(res.posos.WELL_ID, res.limEco).subscribe({
          next: (tactical: any) => {
            console.log(tactical);
            
            this.lastB = Util.formatNumberES(Number(tactical.COEF[0].B),2);
            this.lastDi = Util.formatNumberES(Number(tactical.COEF[0].DI),2);
            this.lastDate = tactical.EUR.slice(-1)[0].VOLUME_DATE;
            this.EUR = Util.formatNumberES(Number(tactical.COEF[0].EUR),2);
            this.Tesp = Util.formatNumberES(Number(tactical.COEF[0].T_EST),2);
            this.NP = Util.formatNumberES(Number(tactical.COEF[0].NP),2);
            let fechasQdvsNp = tactical.EUR.filter((a:any) => {
              if(a.OIL_VOLUME){
                return a.VOLUME_DATE
              }
            });
            fechasQdvsNp = fechasQdvsNp.map((a:any) => a.VOLUME_DATE);
            const fechas = tactical.EUR.map((a:any) => a.VOLUME_DATE);
            const dataSerieCurva1 = tactical.EUR.map((a:any) => a.OIL_VOLUME);
            const dataSerieCurva2 = tactical.EUR.map((a:any) => a.QD);
            const dataSerieEur = tactical.EUR.map((a:any) => a.EUR);
            this.tipo = tactical.COEF[0].TYPE;
            this.updateGraficaQdpNpdD = {
              legend:{
                data:['QD','OIL VOLUME']
              },
              title: {
                text: this.tipo + ' Declination',
              },
              xAxis: {
                data: fechasQdvsNp,
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
                text: 'Forescasting ' + this.tipo + ' Declination',
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
                      value: tactical.COEF[0].NP,
                      name: 'Np',
                    },
                    {
                      value: tactical.COEF[0].EUR,
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
    this.backEndSuscribe = this.operationalService
      .consultaListaDePosos()
      .subscribe({
        next: (value: any) => {
          this.wellList = value.filter(
            (value: { WELL_TYPE: string }) => value.WELL_TYPE == 'OIL'
          );
          const avanico34 = this.wellList.findIndex((data:any)=> data.WELL_NAME === 'ABANICO-34');
          this.tacticalForm.patchValue({
            posos: this.wellList[avanico34 != -1 ? avanico34 : 0],
            limEco: 30,
          });
        },
      });
  }

  buildGraficaQdpNpdD() {
    this.graficaQdpNpdD = {
      title: {
        text: 'Declination',
        left: 'center',
      },
      toolbox:{
        top: '1%',
        right: '5%',
        feature: {
          dataZoom: {
            yAxisIndex: 'all',
          },
          restore: {},
          saveAsImage: {},
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '5%',
        right: '1%',
        bottom: '10%',
        top: '10%'
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
        left: '5%',
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
        text: 'Forescasting Declination',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      toolbox:{
        top: '1%',
        right: '5%',
        feature: {
          dataZoom: {
            yAxisIndex: 'all',
          },
          restore: {},
          saveAsImage: {},
        },
      },
      grid: {
        left: '3%',
        right: '3%',
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
        left: '5%',
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
        left: '1%',
        right: '1%',
        bottom: '10%',
        containLabel: true,
      },
      title: {
        text: 'Np - Eur',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: '5%',
      },
      series: [
        {
          name: 'Data',
          type: 'pie',
          radius: '50%',
          label:{
            formatter: '{d}%',
          },
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
