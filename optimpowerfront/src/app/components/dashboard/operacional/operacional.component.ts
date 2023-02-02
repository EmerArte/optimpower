import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataWellService } from './data/shared.data.service';
import { OperacionalService } from './operacional.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operacional',
  templateUrl: './operacional.component.html',
})
export class OperacionalComponent implements OnInit{

  page: boolean = false;
  listaCampos!: any[];
  listaPosos!: any[];

  minDate!: Date;
  maxDate!: Date;
  auxDate!: Date;
  wellForm: any;
  constructor(private formBuilder: FormBuilder,
    private wellService: DataWellService,private service: OperacionalService, public route: Router){
  }
  ngOnInit(): void {
    this.construirFormulario();
    this.consultaListaPozos();
    this.consultaListaCampos();
    this.wellForm.valueChanges.subscribe((e:any) => {
      if(e.fechaInicial!= null && e.fechaFinal!= null  && e.campos!= null  && e.posos != null){

        
        this.wellService.setDataWell(e)
      }
    });
  }
  construirFormulario() {
    this.wellForm = this.formBuilder.group({
      fechaInicial: [null, Validators.required],
      fechaFinal: [null, Validators.required],
      campos: [this.listaCampos, Validators.required],
      posos: [this.listaPosos, Validators.required]
    });
    
  }
  consultaListaPozos() {
    this.service.consultaListaDePosos().subscribe((data: any) => {
      this.listaPosos = data;
      if(this.listaPosos[0] != null || this.listaPosos[0] != undefined){
        this.wellForm.get('posos').patchValue(this.listaPosos[0])
        this.minDate = new Date(this.wellForm.get('posos').value.MIN_DATE);
        this.maxDate =  new Date(this.wellForm.get('posos').value.MAX_DATE)
        this.setFechaInicialFinal();
      }
    });
    }
    consultaListaCampos(){
      this.service.consultaListaDeCampos().subscribe((data: any) => {
        this.listaCampos = data;
        if(this.listaCampos[0] != null || this.listaCampos[0] != undefined){
          this.wellForm.get('campos').patchValue( this.listaCampos[0])
          
        }
      });
    }
    setFechaInicialFinal(){
      this.auxDate = new Date(this.maxDate);
      this.wellForm.get('fechaFinal').patchValue(this.maxDate);
      this.wellForm.get('fechaInicial').patchValue(new Date(this.auxDate.setMonth(this.auxDate.getMonth()-6)));
     
    }
}
