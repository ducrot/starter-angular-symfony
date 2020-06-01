import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ServiceError as ServiceErrorMessage} from "../../../pb/app/service-error";

export class ServiceError implements Error {

  name = 'ServiceError';
  message: string;
  stack?: string;
  requestId?: string;
  response: HttpErrorResponse;

  constructor(message: string, response: HttpErrorResponse, requestId?: string, stack?: string) {
    this.message = message;
    this.response = response;
    this.requestId = requestId;
    this.stack = stack;
  }

  toString() {
    const l = [this.name + ': ' + this.message];
    if (typeof this.requestId === 'string') {
      l.push('');
      l.push('Request-ID: ' + this.requestId);
    }
    if (typeof this.stack === 'string') {
      l.push('');
      l.push('Stack:');
      l.push(this.stack);
    }
    return l.join('\n');
  }
}


@Injectable()
export class ServiceErrorInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {

        if (response.headers.get('Content-Type') === 'application/protobuf' && response.error instanceof ArrayBuffer) {
          try {
            const pb = ServiceErrorMessage.decode(new Uint8Array(response.error));
            return throwError(new ServiceError(pb.message, response, pb.requestId, pb.stack));
          } catch (e) {
            //
          }
        }

        if (response.headers.get('Content-Type') === 'application/json' && response.error !== null && typeof response.error === 'object' && typeof response.error.message === 'string') {
          const requestId = typeof response.error.request_id === 'string' ? response.error.request_id : undefined;
          const stack = typeof response.error.stack === 'string' ? response.error.stack : undefined;
          return throwError(new ServiceError(response.error.message, response, requestId, stack));
        }

        return throwError(response);
      })
    );
  }

}

