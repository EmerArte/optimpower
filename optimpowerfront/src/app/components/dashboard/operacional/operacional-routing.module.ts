import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WellComponent } from './well/well.component';
import { CampoComponent } from './campo/campo.component';
import { TanquesComponent } from './tanques/tanques.component';
const routes: Routes = [
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
    path: '', redirectTo: 'field', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionalRoutingModule { }
