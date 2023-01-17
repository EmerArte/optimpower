import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperacionalComponent } from './operacional.component';
import { WellComponent } from './well/well.component';
import { CampoComponent } from './campo/campo.component';
const routes: Routes = [
  {
    path: 'well', component: WellComponent
  },
  {
    path: 'field', component: CampoComponent
  },
  {
    path: '', redirectTo: 'well', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionalRoutingModule { }
