import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { OperacionalComponent } from './components/dashboard/operacional/operacional.component';
import { WellComponent } from './components/dashboard/operacional/well/well.component';
import { CampoComponent } from './components/dashboard/operacional/campo/campo.component';
import { StrategicalComponent } from './components/dashboard/strategical/strategical.component';
import { TacticalComponent } from './components/dashboard/tactical/tactical.component';
import { AuthGuardService } from '../guard/auth-guard.service';
import { TanquesComponent } from './components/dashboard/operacional/tanques/tanques.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'operational',
        component: OperacionalComponent,
        children: [
          {
            path: 'well',
            component: WellComponent,
          },
          {
            path: 'field',
            component: CampoComponent,
          },

          {
            path: 'surfice',
            component: TanquesComponent,
          },
          {
            path: '',
            redirectTo: '/dashboard/operational/well',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: '',
        redirectTo: '/dashboard/operational/well',
        pathMatch: 'full',
      },
      {
        path: 'strategical',
        component: StrategicalComponent,
      },
      {
        path: 'tactical',
        component: TacticalComponent,
      }
    ],
    canActivate: [AuthGuardService],
  },
  {
    path: '',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
