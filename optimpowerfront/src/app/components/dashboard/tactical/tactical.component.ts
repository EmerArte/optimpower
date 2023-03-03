import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CoolTheme } from '../../custom.theme.echart';
import { EChartsOption } from 'echarts';
import { TacticalService } from './tactical.service';
import { LoadingService } from 'src/app/services/loading.service';
import { OperacionalService } from '../operacional/operacional.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-tactical',
  templateUrl: './tactical.component.html',
  styleUrls: ['./tactical.component.scss'],
})
export class TacticalComponent implements OnInit, OnDestroy{
  cargando: boolean = true;
  backEndSuscribe: any;
  wellList:any[] = [];


  coolTheme = CoolTheme;
  graficaQdpNpdDInstance: any;
  graficaQdpNpdD: EChartsOption = {};
  updateGraficaQdpNpdD: any;

  graficaNpEurDInstance: any;
  graficaNpEur: EChartsOption = {};
  updateGraficaNpEur: any;
  constructor(
    private tacticalService: TacticalService,
    public loading: LoadingService,
    private operationalService: OperacionalService,
    private form: FormBuilder
  ) {}
  ngOnDestroy(): void {
    this.backEndSuscribe.unsuscribe();
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
    this.consultaBackEnd()
    this.buildGraficaQdpNpdD();
    this.builGraficaNpEur();
  }

  consultaBackEnd(){
    this.backEndSuscribe = this.operationalService.consultaListaDePosos().subscribe({
      next: (value:any)=>{
        this.wellList = value;
      }
    })
  }



  buildGraficaQdpNpdD() {
    this.graficaQdpNpdD = {
      title: {
        text: 'Income of Germany and France since 1950',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        nameLocation: 'middle',
        minorSplitLine: {
          show: true,
        },
      },
      yAxis: {
        name: 'Income',
        minorSplitLine: {
          show: true,
        },
      },
      series: [
        {
          data: [],
          type: 'line',
          showSymbol: false,
          lineStyle: {
            color: '#5470C6',
            width: 3,
            type: 'dashed',
          },
        },
        {
          data: [],
          type: 'line',
          showSymbol: false,
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
  onGraficaNpEur(e: any) {
    this.graficaNpEurDInstance = e;
  }
}
