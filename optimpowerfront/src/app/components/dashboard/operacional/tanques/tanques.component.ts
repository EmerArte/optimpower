import { Component, OnInit } from '@angular/core';
import { TanksService } from './tanks.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-tanques',
  templateUrl: './tanques.component.html',
  styleUrls: ['./tanques.component.css']
})
export class TanquesComponent implements OnInit{

  listaCampos!: any[];
  listaTanques!: any[];

  minDate!: Date;
  maxDate!: Date;
  auxDate!: Date;
  tanksForm: any;

  constructor(private formBuilder: FormBuilder, private tankservice: TanksService, public loadingService: LoadingService) {
    this.construirFormulario();
  }

  ngOnInit(): void {
    
  }
  construirFormulario(){
    this.tanksForm = this.formBuilder.group({
      fechaInicial: [null, Validators.required],
      fechaFinal: [null, Validators.required],
      campos: [this.listaCampos, Validators.required],
      tanks: [this.listaTanques, Validators.required]
    });
  }
  consultaTanques(){
    this.tankservice.listTanks().subscribe({
      next: (value:any) =>{
        this.listaTanques = value;
      }
    })
  }

}
