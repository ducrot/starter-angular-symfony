import {
  MethodInfo,
  NextUnaryFn,
  RpcError,
  RpcInterceptor,
  RpcMetadata,
  RpcOptions,
  ServiceInfo,
  UnaryCall
} from '@protobuf-ts/runtime-rpc';
import { AuthService } from '../service/auth.service';
import { AuthenticationRoutingService } from '../service/authentication-routing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { TwirpErrorCode } from '@protobuf-ts/twirp-transport';


@Injectable()
export class AuthenticationRpcInterceptor implements RpcInterceptor {


  constructor(
    private readonly authService: AuthService,
    private readonly routing: AuthenticationRoutingService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  private static isTwirpError(reason: any, code: TwirpErrorCode): boolean {
    if (reason instanceof RpcError) {
      if (TwirpErrorCode[reason.code] === code) {
        return true;
      }
    }
    return false;
  }


  interceptUnary(next: NextUnaryFn, service: ServiceInfo, method: MethodInfo, input: object, options?: RpcOptions): UnaryCall {
    const opt: RpcOptions = options ?? {};
    if (!opt.meta) {
      opt.meta = {};
    }
    this.addAuthorizationHeader(opt.meta);

    const original = next(service, method, input, opt);

    const responseHeaders = original.responseHeaders.catch(
      reason => {
        if (AuthenticationRpcInterceptor.isTwirpError(reason, TwirpErrorCode.unauthenticated)) {
          // token missing or other invalid
          this.authService.destroySession();
          this.routing.onNotAuthenticated(this.router.url);
        }
        throw reason;
      }
    );

    return new UnaryCall(
      original.serviceInfo,
      original.methodInfo,
      original.requestHeaders,
      original.requestMessage,
      responseHeaders,
      original.responseMessage,
      original.responseStatus,
      original.responseTrailers,
      () => original.cancel()
    );
  }

  private addAuthorizationHeader(meta: RpcMetadata): void {
    const exists = meta.Authorization !== undefined && meta.Authorization === '';
    if (exists) {
      return;
    }
    const token = this.authService.token;
    if (!token) {
      return;
    }
    meta.Authorization = 'Bearer ' + token;
  }


}
