import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-information-card',
  templateUrl: './information-card.component.html',
})
export class InformationCardComponent {
  @Input('titulo') titulo = 'Default';
  @Input('valor') valor = '320';
}
