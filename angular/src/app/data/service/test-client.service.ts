import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env';

@Injectable({
  providedIn: 'root'
})
export class TestClient {


  constructor(private readonly http: HttpClient) {
  }


  luckyNumber(): Observable<number> {
    return this.http.get<number>(`${environment.apiEndpoint}/lucky-number`);
  }


  badRequest(): Observable<unknown> {
    return this.http.get<unknown>(`${environment.apiEndpoint}/bad-request`);
  }


  processingError(): Observable<unknown> {
    return this.http.get<unknown>(`${environment.apiEndpoint}/processing-error`);
  }


  unexpectedError(): Observable<unknown> {
    return this.http.get<unknown>(`${environment.apiEndpoint}/unexpected-error`);
  }


}
