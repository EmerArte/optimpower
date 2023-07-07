import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NAME_LOCALSTORAGE } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(private router: Router){

  }
  ngOnInit(): void {
    this.validateLogin();
  }
  validateLogin(){
    if (localStorage.getItem(NAME_LOCALSTORAGE)){
      this.router.navigate(['dashboard'])
    }
  }
 //develop branch

}
