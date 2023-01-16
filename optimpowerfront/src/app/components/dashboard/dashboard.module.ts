import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {WellComponent} from "./pages/operacional/well/well.component";
import {CampoComponent} from "./pages/operacional/campo/campo.component";
import {TacticalComponent} from "./pages/tactical/tactical.component";
import {StrategicalComponent} from "./pages/strategical/strategical.component";
import { OperacionalModule } from './pages/operacional/operacional.module';
import {DashboardComponent} from "./dashboard.component";
import {HeaderprincipalComponent} from "./headerprincipal/headerprincipal.component";


@NgModule({
  declarations: [
    HeaderprincipalComponent,
    DashboardComponent,
    WellComponent,
    CampoComponent,
    TacticalComponent,
    StrategicalComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    OperacionalModule
  ]
})
export class DashboardModule { }
