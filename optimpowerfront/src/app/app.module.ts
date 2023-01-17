import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { LoginComponent } from './components/login/login.component';
import { FormularioLoginComponent } from './components/login/formulario-login/formulario-login.component';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FormularioLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
    DashboardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
