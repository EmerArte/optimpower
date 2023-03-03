import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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

  typeCurva: any;

  graficaNpEurDInstance: any;
  graficaNpEur: EChartsOption = {};
  updateGraficaNpEur: any;
  constructor(
    private tacticalService: TacticalService,
    public loading: LoadingService,
    private operationalService: OperacionalService,
    private form: FormBuilder
  ) {
    this.tacticalForm = form.group({
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
    this.consultaBackEnd();
    this.buildGraficaQdpNpdD();
    this.builGraficaNpEur();

    this.tacticalForm.valueChanges.subscribe({
      next: (res: any) => {
        console.log(res);
        this.loading.setLoading(true);
        this.tacticalService.getDeclinacion(res.posos.WELL_ID).subscribe({
          next: (tactical: any) => {
            const legendToDeclination = [];
            const fechas = [];
            const dataSerieCurva1 = [];
            const dataSerieCurva2 = [];
            legendToDeclination.push(tactical[0].TYPE);
            legendToDeclination.push(tactical[0].WELL_NAME);
            for (const data of tactical) {
              dataSerieCurva2.push(data.QD);
              dataSerieCurva1.push(data.OIL_VOLUME);
              fechas.push(data.VOLUME_DATE);
            }
            this.updateGraficaQdpNpdD = {
              legend: {
                data: legendToDeclination,
              },
              title: {
                text: tactical[0].TYPE + ' Declination',
              },
              xAxis: {
                data: fechas,
              },
              series: [
                {
                  name: legendToDeclination[0],
                  data: dataSerieCurva2,
                  type: 'line',
                  showSymbol: false,
                  lineStyle: {
                    color: '#B600FF',
                    width: 3,
                    type: 'dashed',
                  },
                },
                {
                  name: legendToDeclination[1],
                  data: dataSerieCurva1,
                  type: 'line',
                  showSymbol: false,
                  lineStyle: {
                    color: '#0C00FF',
                    width: 3,
                  },
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
        right: '5%',
        bottom: '5%',
        top: '10%',
      },
      xAxis: {
        type: 'category',
        nameLocation: 'middle',
        name: 'Date',
        data: [],
      },
      legend: {
        data: [],
        top: '5%',
        left: '1%',
      },
      yAxis: {
        name: 'BOPD',
        nameLocation: 'middle',
      },
      series: [],
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
  onGraficaNpEur(e: any) {
    this.graficaNpEurDInstance = e;
  }
}
