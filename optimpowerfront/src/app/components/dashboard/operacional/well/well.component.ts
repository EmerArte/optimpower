import { Component, OnInit } from '@angular/core';
import { OperacionalService } from '../operacional.service';

@Component({
  selector: 'app-well',
  templateUrl: './well.component.html',
  styleUrls: ['./well.component.css']
})
export class WellComponent implements OnInit {
  pozo:number = 3;
  
  constructor(private service: OperacionalService){
  }
  ngOnInit(): void {
    
  }
  
  consultaVolumenOfWellByDate(well:number = this.pozo, dateRange:string){
    this.service.consultaVolumenOfWellByDate(well, dateRange).subscribe((res:any) =>{
        console.log(JSON.parse(res));
    })
  }

}
