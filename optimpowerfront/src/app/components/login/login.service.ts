import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {exposedApi} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  LOGIN_API = exposedApi.API + "/api/auth/login";

  constructor(private httpClient: HttpClient) { }

  authenticate(email: string, password: string) {
    const body = {
      email,
      password
    };
    return this.httpClient.post(
      this.LOGIN_API,
      body
    );
  }
}

export const NAME_LOCALSTORAGE = 'tokenUser';
