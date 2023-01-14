import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-headerprincipal',
  templateUrl: './headerprincipal.component.html',
  styleUrls: ['./headerprincipal.component.css']
})
export class HeaderprincipalComponent {
  constructor(private router: Router){

  }
  openDashboard(pageName: string){
    this.router.navigate([`${pageName}`]);
  }
}
