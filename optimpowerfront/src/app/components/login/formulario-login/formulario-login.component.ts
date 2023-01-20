import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {LoginService, NAME_LOCALSTORAGE} from '../login.service';
import {Util} from '../../../../utils/util';

@Component({
  selector: 'app-formulario-login',
  templateUrl: './formulario-login.component.html',
  styleUrls: ['./formulario-login.component.css'],
})
export class FormularioLoginComponent {

  formLogin: any;
  loading:boolean = false;
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private loginService: LoginService) {
    this.construirFormulario();
  }

  construirFormulario() {
    this.formLogin = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  openDashboard(pageName: string) {
    this.loading = true;
    this.loginService.authenticate(this.formLogin.controls.username.value, this.formLogin.controls.password.value).subscribe({

      next: (data: any) => {
        this.loading = false;
        if (data.token) {
          localStorage.setItem(NAME_LOCALSTORAGE, data.token);
          this.router.navigate([`${pageName}`]);
        } else {
          Util.mensajeDialog('Error', 'Invalid credentials');
        }
      },
      error: (e: any)=>{
        this.loading = false;
        Util.mensajeDialog('Error', 'Internal server error, try again');
      }
      
    }
    );
    
  }


}
