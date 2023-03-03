import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-information-card',
  templateUrl: './information-card.component.html',
})
export class InformationCardComponent {
  @Input('titulo') titulo = 'Default';
  @Input('valor') valor = '320';
  @Input('orientacion') orientacion = 'ver';
}
