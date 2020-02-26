import {Injectable} from '@angular/core';
import {Params, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationRoutingService {

  constructor(private router: Router) {
  }


  login(backUrl?: string): void {
    const params: Params = {};
    if (typeof backUrl === 'string') {
      params.b = this.encodeBackUrl(backUrl);
    }
    window.location.href = this.router.createUrlTree(['/login'], {queryParams: params}).toString();
  }


  sessionExpired(backUrl?: string): void {
    const params: Params = {
      expired: true
    };
    if (typeof backUrl === 'string') {
      params.b = this.encodeBackUrl(backUrl);
    }
    window.location.href = this.router.createUrlTree(['/login'], {queryParams: params}).toString();
  }


  private encodeBackUrl(url:string): string {
    if (url.startsWith('/')) {
      return url.substr(1);
    }
    return;
  }


}
