import { Component } from '@angular/core';
@Component({
  selector: 'app-operacional',
  templateUrl: './operacional.component.html',
})
export class OperacionalComponent {
  inicialDate: string = new Date().toLocaleDateString("en-US")
  page: boolean = false;
}
