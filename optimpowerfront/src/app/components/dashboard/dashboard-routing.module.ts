import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperacionalComponent } from './operacional/operacional.component';
import { WellComponent } from './operacional/well/well.component';
import { CampoComponent } from './operacional/campo/campo.component';
import { StrategicalComponent } from './strategical/strategical.component';
import { TacticalComponent } from './tactical/tactical.component';
import { TanquesComponent } from './operacional/tanques/tanques.component';

const routes: Routes = [
  {
    path:'operational', component: OperacionalComponent,
    children:[
      {
        path: 'well', component: WellComponent
      },
      {
        path: 'field', component: CampoComponent
      },
      
      {
        path: 'surfice', component: TanquesComponent
      },
      {
        path: '', redirectTo: '/operational/field', pathMatch:'full'
      }
    ]
  },
  {
    path:'strategical', component: StrategicalComponent
  },
  {
    path: 'tactical', component: TacticalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
