import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginCredentials} from "./login-credentials";
import {Observable} from "rxjs";
import {LoginSuccess} from "./login-success";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationClient {


  constructor(private readonly http: HttpClient) {
  }


  login(credentials: LoginCredentials): Observable<LoginSuccess> {
    // clear authorization header to make sure no expired token is sent
    const options = {
      // headers: {'Authorization': ''}
    };
    return this.http.post<LoginSuccess>(`${environment.apiEndpoint}/auth/login`, credentials, options);
  }


}
