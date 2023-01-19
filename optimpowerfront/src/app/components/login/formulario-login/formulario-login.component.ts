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

    this.loginService.authenticate(this.formLogin.controls.username.value, this.formLogin.controls.password.value).subscribe(
      (data) => {

        if (data.token) {
          localStorage.setItem(NAME_LOCALSTORAGE, data.token);
          this.router.navigate([`${pageName}`]);
          Util.mensajeDialog('Informative', 'Success');
        } else {
          Util.mensajeDialog('Error', 'Error al obtener el token');
        }
      },
      (error) => {
        console.log(error);
        Util.mensajeDialog('Error', 'Error en el servidor intente nuevamente');
      }
    );

  }


}
