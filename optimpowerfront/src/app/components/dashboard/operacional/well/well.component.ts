import { Component, OnInit } from '@angular/core';
import { OperacionalService } from '../operacional.service';
import { EChartsOption, SeriesOption } from 'echarts';

@Component({
  selector: 'app-well',
  templateUrl: './well.component.html',
  styleUrls: ['./well.component.css'],
})
export class WellComponent implements OnInit {
  pozo: number = 3;
  listaPozos: any[]= []
  cargando: boolean = true;
  graficaUno: EChartsOption = {};
  dataGeneral: any ={};

  crudo:string= "";
  fluido:string ="";
  agua:string = "";
  gas:string = "";
  campo:string ="";
  pozoId:string ="";


  fechaAcual: Date = new Date();
  constructor(private service: OperacionalService) {}
  ngOnInit(): void {
    this.consultaVolumenOfWellByDate(this.pozo, '2022-08-15/2023-01-15');
    this.consultaListaPozos();
  }

  consultaVolumenOfWellByDate(well: number, dateRange: string) {
    this.service
      .consultaVolumenOfWellByDate(well, dateRange)
      .subscribe((res: any) => {
        this.dataGeneral = JSON.parse(res);
        console.log(this.dataGeneral);
        this.construirGrafica1(this.dataGeneral);
        this.cargando = false;
        this.crudo = Object.values(this.dataGeneral.opt.OIL_VOLUME).slice(-1).toString();
        this.fluido = Object.values(this.dataGeneral.opt.LIQUID_VOLUME).slice(-1).toString();
        this.agua = Object.values(this.dataGeneral.opt.WATER_VOLUME).slice(-1).toString();
        this.gas = Object.values(this.dataGeneral.opt.GAS_VOLUME).slice(-1).toString();
        this.pozoId = Object.values(this.dataGeneral.opt.WELL_NAME).slice(-1).toString();
      });
  }
  consultaListaPozos(){
    this.service.consultaListaDePozos().subscribe((data:any)=>{
      this.listaPozos = data;
      Object.values(this.listaPozos).slice(-1).map((res:any) => {
        this.campo = res.FIELD_NAME
      });
    })
  }
  construirGrafica1(resJson:any){
    this.graficaUno.title = {
      text: 'Gas(MMSFC), OilRate average, Water(BWPD) & Fluid(BFPD) by time',
    };
    this.graficaUno.tooltip = {
      trigger: 'axis',
    },
    this.graficaUno.legend = {
        left: '3%',
        top: '4%',
        data: [
          'Gas(MMSFC)',
          'OilRate average',
          'Water(BWPD)',
          'Fluid(BFPD)',
        ],
    },
      this.graficaUno.grid = {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    this.graficaUno.toolbox = {
        feature: {
          saveAsImage: {},
        },
    },
    this.graficaUno.xAxis = {
        type: 'category',
        boundaryGap: true,
        data: Object.values(resJson.opt.VOLUME_DATE)
    },
    this.graficaUno.yAxis = {
        type: 'value',
    };
    this.graficaUno.series = [
      {
        name: 'Gas(MMSFC)',
        type: 'line',
        stack: 'Total',
        data: Object.values(resJson.opt.GAS_VOLUME),
      },
      {
        name: 'OilRate average',
        type: 'line',
        stack: 'Total',
        data: Object.values(resJson.opt.OIL_VOLUME),
      },
      {
        name: 'Water(BWPD)',
        type: 'line',
        stack: 'Total',
        data: Object.values(resJson.opt.WATER_VOLUME),
      },
      {
        name: 'Fluid(BFPD)',
        type: 'line',
        stack: 'Total',
        data: Object.values(resJson.opt.LIQUID_VOLUME),
      },
    ];
  }
 padTo2Digits(num:number) {
  return num.toString().padStart(2, '0');
}

 formatDate(date:Date) {
  return [
    this.padTo2Digits(date.getDate()),
    this.padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');
}
}