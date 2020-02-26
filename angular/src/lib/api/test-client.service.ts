import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TestClient {


  constructor(private readonly http: HttpClient) {
  }


  luckyNumber(): Observable<number> {
    return this.http.get<number>(`${environment.apiEndpoint}/lucky-number`);
  }


}
