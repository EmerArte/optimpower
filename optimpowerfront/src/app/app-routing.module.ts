import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import {StrategicalComponent} from "./components/dashboard/pages/strategical/strategical.component";
import {TacticalComponent} from "./components/dashboard/pages/tactical/tactical.component";

const routes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent, children:[
      {
        path: 'operational', loadChildren: () => import('../app/components/dashboard/pages/operacional/operacional.module').then(m => m.OperacionalModule),
      },
      {
        path: 'strategical', component: StrategicalComponent,
      },
      {
        path: 'tactical', component: TacticalComponent,
      },
    ]
  },
  {
    path: '', component: LoginComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
