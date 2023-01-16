import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperacionalRoutingModule } from './operacional-routing.module';
import { TestgraficasComponent } from './well/testgraficas/testgraficas.component';


@NgModule({
  declarations: [


    TestgraficasComponent
  ],
  exports: [
    TestgraficasComponent
  ],
  imports: [
    CommonModule,
    OperacionalRoutingModule
  ]
})
export class OperacionalModule { }
