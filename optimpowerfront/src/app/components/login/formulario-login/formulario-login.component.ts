import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario-login',
  templateUrl: './formulario-login.component.html',
  styleUrls: ['./formulario-login.component.css'],
})
export class FormularioLoginComponent {
  constructor(private router: Router) {}
  openDashboard(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }
}
