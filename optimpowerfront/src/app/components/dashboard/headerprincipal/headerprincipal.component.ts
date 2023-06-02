import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-headerprincipal',
  templateUrl: './headerprincipal.component.html',
  styleUrls: ['./headerprincipal.component.css']
})
export class HeaderprincipalComponent {
  isOpen:boolean = false;
  constructor(public route: Router){

  }
  logout(){
    localStorage.clear();
    this.route.navigate(['/']);
  }
}
