import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginCredentials} from "./login-credentials";
import {Observable} from "rxjs";
import {LoginSuccess} from "./login-success";
import {environment} from "../environments/environment";

@Injectable()
export class AuthenticationClient {


  constructor(private readonly http: HttpClient) {
  }


  login(credentials: LoginCredentials): Observable<LoginSuccess> {
    return this.http.post<LoginSuccess>(`${environment.apiEndpoint}/auth/login`, credentials);
  }


}
