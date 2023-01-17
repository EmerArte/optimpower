import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperacionalComponent } from './operacional/operacional.component';
import { WellComponent } from './operacional/well/well.component';
import { CampoComponent } from './operacional/campo/campo.component';
import { StrategicalComponent } from './strategical/strategical.component';

const routes: Routes = [
  {
    path:'operational', component: OperacionalComponent
  },
  {
    path:'strategical', component: StrategicalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
