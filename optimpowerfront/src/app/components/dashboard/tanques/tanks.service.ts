import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exposedApi } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TanksService {
  URL = exposedApi.API + "/api/"
  constructor(private http: HttpClient) {}

  tanksinfo(dateRange:string){
    return this.http.get(`${this.URL}tankinfobydate/${dateRange}`);
  }
  tankInfoBySurface(dateRange:string, surfice: any){
    return this.http.get(`${this.URL}tankinfobydate/${surfice}/${dateRange}`);
  }
  listTanks(){
    return this.http.get(`${this.URL}gettanksdataset`)
  }
}
