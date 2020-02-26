import {Injectable} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationRoutingService {

  constructor(private router: Router) {
  }


  private readonly homeUrl = '/';


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


  afterLoginSuccess(route: ActivatedRoute): void {
    let next: string;
    const b = route.snapshot.queryParamMap.get('b');
    if (typeof b === 'string') {
      next = b.startsWith('/') ? b : `/${b}`;
    } else {
      next = this.homeUrl;
    }
    this.router.navigate([next]).catch(e => console.error(e));
  }


  private encodeBackUrl(url: string): string | undefined {
    if (url === this.homeUrl) {
      return undefined;
    }
    if (url.startsWith('/login')) {
      return undefined;
    }
    if (url === '') {
      return undefined;
    }
    if (url.startsWith('/')) {
      return url.substr(1);
    }
    return url;
  }


}
