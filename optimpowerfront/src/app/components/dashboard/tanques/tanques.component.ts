import { Component } from '@angular/core';

@Component({
  selector: 'app-tanques',
  templateUrl: './tanques.component.html',
  styleUrls: ['./tanques.component.css']
})
export class TanquesComponent {
  listaCampos!: any[];
  listaTanques!: any[];

  minDate!: Date;
  maxDate!: Date;
  auxDate!: Date;
  tanksForm: any;
}
