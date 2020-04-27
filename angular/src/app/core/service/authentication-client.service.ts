import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginCredentials} from "@data/schema/login-credentials";
import {Observable} from "rxjs";
import {LoginSuccess} from "@data/schema/login-success";
import {environment} from "@env";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationClient {


  constructor(private readonly http: HttpClient) {
  }


  login(credentials: LoginCredentials): Observable<LoginSuccess> {
    return this.http.post<LoginSuccess>(`${environment.apiEndpoint}/auth/login`, credentials);
  }


}
