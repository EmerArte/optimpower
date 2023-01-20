import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exposedApi } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OperacionalService {
  URL = exposedApi.API + "/api/"
  constructor(private http: HttpClient) {}

  consultaVolumenOfWellByDate(well:number, dateRange:string){
    return this.http.get(`${this.URL}wellvolbydate/${well}/${dateRange}`);
  }
  consultaListaDeCampos(){
    return this.http.get(`${this.URL}getfieldsdataset`);
  }
  consultaListaDePosos(){
    return this.http.get(`${this.URL}getwellsdataset`)
  }

}
