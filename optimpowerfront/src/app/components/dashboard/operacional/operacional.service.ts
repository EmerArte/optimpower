import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperacionalService {
  urlConstants: string = "https://optimback.azurewebsites.net/api/"
  constructor(private http: HttpClient) {}

  consultaVolumenOfWellByDate(well:number, dateRange:string){
    return this.http.get(`${this.urlConstants}wellvolbydate/${well}/${dateRange}`);
  }
  consultaListaDePozos(){
    return this.http.get(`${this.urlConstants}getfieldsdataset`);
  }
}
