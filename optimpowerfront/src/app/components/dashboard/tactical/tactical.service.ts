import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exposedApi } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TacticalService {
  URL = exposedApi.API + "/api/"
  constructor(private http: HttpClient) {}

  getDeclinacion(well:number){
    return this.http.get(`${this.URL}getdeclination/${well}`);
  }
}