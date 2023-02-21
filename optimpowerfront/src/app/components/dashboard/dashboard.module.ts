import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {DashboardComponent} from "./dashboard.component";
import {HeaderprincipalComponent} from "./headerprincipal/headerprincipal.component";
import { OperacionalModule } from './operacional/operacional.module';
import {ReactiveFormsModule} from '@angular/forms';
import { StrategicalModule } from './strategical/strategical.module';
import { TacticalModule } from './tactical/tactical.module';
import { TanquesModule } from './tanques/tanques.module';


@NgModule({
  declarations: [
    HeaderprincipalComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    OperacionalModule,
    StrategicalModule,
    TacticalModule,
    TanquesModule,
    ReactiveFormsModule
  ]
})
export class DashboardModule { }
