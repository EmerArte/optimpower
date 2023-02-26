import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataWellService } from './data/shared.data.service';
import { OperacionalService } from './operacional.service';
import { Router } from '@angular/router';
import { TanksService } from './tanques/tanks.service';

@Component({
  selector: 'app-operacional',
  templateUrl: './operacional.component.html',
})
export class OperacionalComponent implements OnInit{

  page: boolean = false;
  listaCampos!: any[];
  listaPosos!: any[];
  listaTanques!: any[];
  minDate!: Date;
  maxDate!: Date;
  auxDate!: Date;
  wellForm = this.formBuilder.group({
    fechaInicial: [new Date(), Validators.required],
    fechaFinal: [new Date(), Validators.required],
    tanques: [this.listaTanques],
    campos: [this.listaCampos, Validators.required],
    posos: [this.listaPosos, Validators.required]
  });

  valorAnterior:any;

  constructor(private formBuilder: FormBuilder,
    private wellService: DataWellService,private service: OperacionalService,private tankservice: TanksService, public route: Router){
  }
  ngOnInit(): void {
    this.consultaListaPozos();

  }
  consultaListaPozos() {
    this.service.consultaListaDePosos().subscribe((data: any) => {
      this.listaPosos = data.filter((value: { WELL_TYPE: string; }) => value.WELL_TYPE == "OIL");
      if(this.listaPosos[0] != null || this.listaPosos[0] != undefined){
        this.consultaListaCampos();
      }
    });
    }
    consultaListaCampos(){
      this.service.consultaListaDeCampos().subscribe((data: any) => {
        this.listaCampos = data;
        if(this.listaCampos[0] != null || this.listaCampos[0] != undefined){
          this.consultaTanques()
         
        }
      });
    }
    cambiosEnElFormulario(){
      
      this.wellForm.valueChanges.subscribe((e:any) => {
        if(JSON.stringify(this.valorAnterior)!=JSON.stringify(e)){
          this.valorAnterior = e;
          if(e.fechaInicial!= null && e.fechaFinal!= null  && e.campos!= null  && e.posos != null){
            this.wellService.setDataWell(e)
            
          }
        }
        
      });
    }
    consultaTanques(){
      this.tankservice.listTanks().subscribe({
        next: (value:any) =>{
          this.listaTanques = value;
          if(this.listaTanques){
            if(this.listaTanques.length > 0){
              this.minDate = new Date(this.listaPosos[0].MIN_DATE);
              this.maxDate =  new Date(this.listaPosos[0].MAX_DATE)
              this.auxDate = new Date(this.maxDate);
              this.wellForm.patchValue({
                fechaInicial: new Date(this.auxDate.setDate(this.auxDate.getDate()-(this.auxDate.getDate() -1))),
                fechaFinal: this.maxDate,
                tanques: this.listaTanques[0],
                campos: this.listaCampos[0],
                posos:this.listaPosos[0],
              });
              this.cambiosEnElFormulario();
            }
          }
        }
      })
    }
}
