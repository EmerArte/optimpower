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
  wellForm: any;
  constructor(private formBuilder: FormBuilder,
    private wellService: DataWellService,private service: OperacionalService,private tankservice: TanksService, public route: Router){
      this.construirFormulario()
  }
  ngOnInit(): void {
    this.consultaListaPozos();

  }
  construirFormulario() {
    this.wellForm = this.formBuilder.group({
      fechaInicial: [null, Validators.required],
      fechaFinal: [null, Validators.required],
      tanques: [null],
      campos: [this.listaCampos, Validators.required],
      posos: [this.listaPosos, Validators.required]
    });
    
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
        if(e.fechaInicial!= null && e.fechaFinal!= null  && e.campos!= null  && e.posos != null){
          this.wellService.setDataWell(e)
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
              this.wellForm = this.formBuilder.group({
                fechaInicial: [new Date(this.auxDate.setMonth(this.auxDate.getMonth()-1)), Validators.required],
                fechaFinal: [this.maxDate, Validators.required],
                tanques: [this.listaTanques],
                campos: [this.listaCampos, Validators.required],
                posos: [this.listaPosos, Validators.required]
              });
              this.wellForm.get('campos').patchValue( this.listaCampos[0])
              this.wellForm.get('tanques').patchValue( this.listaTanques[0])
              this.wellForm.get('posos').patchValue(this.listaPosos[0])
              this.cambiosEnElFormulario();
            }
          }
        }
      })
    }
}
