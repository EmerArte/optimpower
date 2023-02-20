import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationCardComponent } from '../shared/information-card/information-card.component';
import { NgxEchartsModule } from 'ngx-echarts';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio' 
import { TanquesComponent } from './tanques.component';
@NgModule({
  declarations: [
    TanquesComponent
  ],
  imports: [
    CommonModule,
    InformationCardComponent,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatRadioModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ], 
  exports:[NgxEchartsModule]
})
export class TanquesModule { }
