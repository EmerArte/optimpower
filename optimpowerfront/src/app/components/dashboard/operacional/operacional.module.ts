import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperacionalComponent } from './operacional.component';
import { WellComponent } from './well/well.component';
import { CampoComponent } from './campo/campo.component';
import { OperacionalRoutingModule } from './operacional-routing.module';
import { InformationCardComponent } from '../shared/information-card/information-card.component';

@NgModule({
  declarations: [
    OperacionalComponent,
    WellComponent,
    CampoComponent
  ],
  imports: [
    CommonModule,
    InformationCardComponent,
    OperacionalRoutingModule
  ]
})
export class OperacionalModule { }
