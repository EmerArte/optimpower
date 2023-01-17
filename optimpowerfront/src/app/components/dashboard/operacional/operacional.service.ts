import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperacionalService {
  static URL: string = "https://optimback.azurewebsites.net/api/"
  constructor(private http: HttpClient) {}

  consultaVolumenOfWellByDate(well:number, dateRange:string) : Observable<string>{
    return this.http.get<string>(URL+ well.toString() + "/"+ dateRange);
  }
}
