import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperacionalComponent } from './operacional.component';
import { CampoComponent } from './campo/campo.component';
import { OperacionalRoutingModule } from './operacional-routing.module';
import { InformationCardComponent } from '../shared/information-card/information-card.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { WellComponent } from './well/well.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
@NgModule({
  declarations: [
    OperacionalComponent,
    CampoComponent,
    WellComponent
  ],
  imports: [
    CommonModule,
    InformationCardComponent,
    OperacionalRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ], 
  exports:[NgxEchartsModule]
})
export class OperacionalModule { }
