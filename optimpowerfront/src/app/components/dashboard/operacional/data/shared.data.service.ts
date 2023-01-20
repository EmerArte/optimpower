import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataWellService {
private dataWell = new BehaviorSubject<any>(null);
getData = this.dataWell.asObservable();

constructor() {}

  setDataWell(data: any) {
    this.dataWell.next(data);
  }
}