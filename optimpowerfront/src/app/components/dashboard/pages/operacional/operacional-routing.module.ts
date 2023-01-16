import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CampoComponent} from "./campo/campo.component";
import {WellComponent} from "./well/well.component";

const routes: Routes = [
  {
    path: 'well', component: WellComponent,
  },
  {
    path: '', component: WellComponent,
  },
  {
    path: 'campo', component: CampoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionalRoutingModule { }
