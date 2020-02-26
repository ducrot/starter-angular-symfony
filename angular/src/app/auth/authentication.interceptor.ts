import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {SessionService} from "./session.service";
import {environment} from "../../environments/environment";
import {bearerTokenParse} from "../../lib/bearer-token";
import {catchError} from "rxjs/operators";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private readonly session: SessionService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    request = this.addAuthorizationHeader(request);

    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {

        if (response.status !== 401) {
          // pass error on
          return throwError(response);
        }

        // in any case, we have to logout
        // TODO navigate
        // this.authService.logout();

        let wwwAuthenticate = bearerTokenParse(response.headers.get('WWW-Authenticate'));
        if (wwwAuthenticate && wwwAuthenticate.error_description == 'Expired token') {

          // session expired
          // we might want to prompt for authentication and retry GET request
          // https://www.learnrxjs.io/operators/error_handling/retrywhen.html
          // TODO navigate
          // this.authRouting.navigate401SessionExpired();

        } else {

          // token missing or other token error
          // TODO navigate
          // this.authRouting.navigate401Other();

        }

      })
    );
  }


  private addAuthorizationHeader(req: HttpRequest<any>): HttpRequest<any> {
    if (req.headers.has('Authorization')) {
      if (req.headers.get('Authorization') === '') {
        return req.clone({
          headers: req.headers.delete("Authorization")
        });
      }
      return req;
    }
    const token = this.session.token;
    if (!token) {
      return req;
    }
    if (!req.url.startsWith(environment.apiEndpoint)) {
      return req;
    }
    return req.clone({
      headers: req.headers.set("Authorization", "Bearer " + token)
    });
  }


}
