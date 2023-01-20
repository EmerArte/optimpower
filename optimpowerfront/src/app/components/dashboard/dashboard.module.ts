import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {DashboardComponent} from "./dashboard.component";
import {HeaderprincipalComponent} from "./headerprincipal/headerprincipal.component";
import { OperacionalModule } from './operacional/operacional.module';
import { StrategicalComponent } from './strategical/strategical.component';
import { TacticalComponent } from './tactical/tactical.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    HeaderprincipalComponent,
    DashboardComponent,
    StrategicalComponent,
    TacticalComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    OperacionalModule,
    ReactiveFormsModule
  ]
})
export class DashboardModule { }
