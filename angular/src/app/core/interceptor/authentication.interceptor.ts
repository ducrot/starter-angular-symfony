import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {SessionService} from '@app/service/session.service';
import {environment} from '@env';
import {bearerTokenParse} from '@app/lib/bearer-token';
import {catchError} from 'rxjs/operators';
import {AuthenticationRoutingService} from '@app/service/authentication-routing.service';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(
    private readonly session: SessionService,
    private readonly routing: AuthenticationRoutingService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    request = this.addAuthorizationHeader(request);

    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {
        if (response.status === 401) {
          if (this.isExpiredTokenResponse(response)) {
            // session expired
            this.session.destroySession();
            this.routing.onSessionExpired(this.router.url);
          } else {
            // token missing or other token error
            this.session.destroySession();
            this.routing.onNotAuthenticated(this.router.url);
          }
        }
        return throwError(response);
      })
    );
  }


  private isExpiredTokenResponse(response: HttpErrorResponse): boolean {
    const wwwAuthenticate = bearerTokenParse(response.headers.get('WWW-Authenticate'));
    return wwwAuthenticate && wwwAuthenticate.error_description === 'Expired token';
  }


  private addAuthorizationHeader(req: HttpRequest<any>): HttpRequest<any> {
    if (req.headers.has('Authorization')) {
      if (req.headers.get('Authorization') === '') {
        return req.clone({
          headers: req.headers.delete('Authorization')
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
      headers: req.headers.set('Authorization', 'Bearer ' + token)
    });
  }


}
