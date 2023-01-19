import { Component } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
@Component({
  selector: 'app-operacional',
  templateUrl: './operacional.component.html',
})
export class OperacionalComponent {
  inicialDate: string = new Date().toLocaleDateString("en-US")
  page: boolean = false;
}
