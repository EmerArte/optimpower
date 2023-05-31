import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {LoginService, NAME_LOCALSTORAGE} from '../login.service';
import Swal from 'sweetalert2';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-formulario-login',
  templateUrl: './formulario-login.component.html',
  styleUrls: ['./formulario-login.component.css'],
})
export class FormularioLoginComponent {

  formLogin: any;
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private loginService: LoginService,
              private loadingService : LoadingService) {
    this.construirFormulario();
  }

  construirFormulario() {
    this.formLogin = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  openDashboard(pageName: string) {
    this.loginService.authenticate(this.formLogin.controls.username.value, this.formLogin.controls.password.value).subscribe({
      next: (data: any) => {
        if (data.token) {
          this.loadingService.setLoading(false);
          localStorage.setItem(NAME_LOCALSTORAGE, data.token);
          this.router.navigate([`${pageName}`]);
        }
      },
      error: (error: any) => {
        Swal.fire('Oops!', error, 'warning');
      }
  });
    
  }
  isLoading(){
    return this.loadingService.getLoading();
  }


}
