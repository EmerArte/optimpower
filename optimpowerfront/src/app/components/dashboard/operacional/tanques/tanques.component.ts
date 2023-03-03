import { Component, OnDestroy, OnInit } from '@angular/core';
import { TanksService } from './tanks.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';
import { EChartsOption } from 'echarts';
import { CoolTheme } from 'src/app/components/custom.theme.echart';
import { DataWellService } from '../data/shared.data.service';
import { Subscription } from 'rxjs';
import { Util } from 'src/utils/util';

@Component({
  selector: 'app-tanques',
  templateUrl: './tanques.component.html',
  styleUrls: ['./tanques.component.css'],
})
export class TanquesComponent implements OnInit, OnDestroy {
  surficeLast: any;
  surficeSum: any;
  currentDate:any;
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
    private tankservice: TanksService,
    public loadingService: LoadingService,
    private dataForm: DataWellService
  ) {
    //this.resizeChart();
  }

  ngOnInit(): void {
    this.buildPozosChart();
    this.buildtransRecivoEntregaChart();
    this.bouildProductChart();
    this.consultaBackEnd();
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
            next: (res: any) => {
              if (res != null && !(res == 1) && res != undefined) {
                const colors = [
                  '#0400FF',
                  '#00B919',
                  '#8900B9',
                  '#B90000',
                  '#AC6600',
                  '#494949',
                ];
                this.surficeLast = JSON.parse(res.surface_last);
                this.surficeSum = JSON.parse(res.surface_sum);
                this.currentDate = new Date(Number(Object.values(this.surficeLast.YEAR_MONTH_DATE)[0]));
                
                Object.values(this.surficeSum.FACILITY_ID).forEach(
                  (val: any, index: any) => {
                    if (Number(value.tanques.FACILITY_ID) == Number(val)) {
                      console.log(this.surficeSum);

                      this.uptadeTransRecivoEntrega = {
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
                                value: Object.values(this.surficeSum.CAPACITY)[
                                  index
                                ],
                                itemStyle: {
                                  color: colors[0],
                                },
                              },
                              {
                                value: Object.values(
                                  this.surficeSum.MEASURED_WATER_VOLUME
                                )[index],
                                itemStyle: {
                                  color: colors[1],
                                },
                              },
                              {
                                value: Object.values(
                                  this.surficeSum.VOLUME_RAW
                                )[index],
                                itemStyle: {
                                  color: colors[2],
                                },
                              },
                              {
                                value: Object.values(
                                  this.surficeSum.VOLUME_60F
                                )[index],
                                itemStyle: {
                                  color: colors[3],
                                },
                              },
                              {
                                value: Object.values(
                                  this.surficeSum.NET_BARRELS
                                )[index],
                                itemStyle: {
                                  color: colors[4],
                                },
                              },
                            ],
                          },
                        ],
                      };

                      this.updatePozosChart = {
                        xAxis: {
                          data: ['Transf', 'Recived', 'Deliver'],
                        },
                        series: [
                          {
                            data: [
                              {
                                value: Object.values(this.surficeSum.TRANSFER)[
                                  index
                                ],
                                itemStyle: {
                                  color: colors[0],
                                },
                              },
                              {
                                value: Object.values(this.surficeSum.RECEPTION)[
                                  index
                                ],
                                itemStyle: {
                                  color: colors[1],
                                },
                              },
                              {
                                value: Object.values(this.surficeSum.DELIVER)[
                                  index
                                ],
                                itemStyle: {
                                  color: colors[2],
                                },
                              },
                            ],
                          },
                        ],
                      };
                    }
                  }
                );
                this.tankservice.listTanks().subscribe({
                  next: (tanks: any) => {
                    const legendsTanks: any[] = [];
                    const productionData: any[] = [];
                    tanks.forEach((element: any, index:any) => {
                      const obj = {
                        value: this.surficeSum.NET_BARRELS[index],
                        name: element.FACILITY_NAME
                      }
                      legendsTanks.push(element.FACILITY_NAME);
                      productionData.push(obj);
                    });
                    this.updateProduccionTanks = {
                      legend: {
                        data: legendsTanks,
                      },
                      series: [
                        {
                          data: productionData
                        },
                      ],
                    };
                  },
                });
              } else {
                Util.mensajeDialog(
                  'DATA ERROR',
                  'Please select valid date ranges'
                );
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
        left: 'left',
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
        bottom: 10,
        right: 10,
        data: [],
      },
      toolbox: {
        show: false,
      },
      series: [
        {
          name: 'Production',
          type: 'pie',
          center: ['50%', '50%'],
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
        text: 'Transfer, Reception & Deliver by Tank',
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
        top: '5%',
        bottom: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          inside: false,
          rotate: 90,
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
      yAxis: {
        type: 'value',
        nameLocation: 'end',
        nameGap: 20,
      },
      series: [
        {
          data: [],
          type: 'bar',
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
        top: '14%',
        bottom: '1%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          inside: false,
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
      yAxis: {
        type: 'value',
        nameLocation: 'end',
        nameGap: 20,
      },
      series: [
        {
          data: [],
          type: 'bar',
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
