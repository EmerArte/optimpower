import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataWellService } from './data/shared.data.service';
import { OperacionalService } from './operacional.service';

@Component({
  selector: 'app-operacional',
  templateUrl: './operacional.component.html',
})
export class OperacionalComponent implements OnInit{

  page: boolean = false;
  listaCampos: any[] = [];
  listaPosos: any[] = [];

  minDate!: Date;
  maxDate!: Date;

  wellForm: any;
  constructor(private formBuilder: FormBuilder,
    private wellService: DataWellService,private service: OperacionalService){
  }
  ngOnInit(): void {
    this.construirFormulario();
    this.consultaListaPozos();
    this.consultaListaCampos();
  }
  construirFormulario() {
    this.wellForm = this.formBuilder.group({
      fechaInicial: [null, Validators.required],
      fechaFinal: [null, Validators.required],
      campos: [this.listaCampos, Validators.required],
      posos: [this.listaPosos, Validators.required]
    });
    this.wellForm.valueChanges.subscribe((e:any) => {
      if(this.wellForm.fechaInicial!= null && this.wellForm.fechaFinal!= null  && this.wellForm.campos!= null  && this.wellForm.posos!= null){
        this.wellService.setDataWell(e)
      }
    });
  }
  consultaListaPozos() {
    this.service.consultaListaDePosos().subscribe((data: any) => {
      this.listaPosos = data;
      if(this.listaPosos[0] != null || this.listaPosos[0] != undefined){
        this.wellForm.get('posos').patchValue(this.listaPosos[0])
        this.minDate = new Date(this.wellForm.get('posos')?.MIN_DATE);
        this.maxDate =  new Date(this.wellForm.get('posos')?.MAX_DATE)
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
      this.wellForm.get('fechaInicial').patchValue(new Date(this.maxDate.setMonth(this.maxDate.getMonth()-6)))
      this.wellForm.get('fechaFinal').patchValue(this.maxDate)
    }
}
