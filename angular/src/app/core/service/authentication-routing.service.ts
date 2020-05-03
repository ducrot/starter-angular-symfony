import {Injectable} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationRoutingService {

  constructor(private router: Router) {
  }


  private readonly homeUrl = '/';
  private readonly loginUrl = '/auth/login';


  onNotAuthenticated(backUrl?: string): void {
    const e: NavigationExtras = {
      queryParams: {b: this.normalizeBackUrl(backUrl)}
    };
    if (this.router.url.startsWith(this.loginUrl)) {
      // if we are already on the login page, we route the standard way, keeping the SPA alive
      this.router.navigate([this.loginUrl], e).catch(e => console.error(e));
    } else {
      // if we are not already on the login page, we restart the SPA
      window.location.href = this.router.createUrlTree([this.loginUrl], e).toString();
    }
  }


  onSessionExpired(backUrl?: string): void {
    const e: NavigationExtras = {
      queryParams: {expired: true, b: this.normalizeBackUrl(backUrl)}
    };
    window.location.href = this.router.createUrlTree([this.loginUrl], e).toString();
  }


  onLoginSuccess(route: ActivatedRoute): void {
    let next: string;
    const b = route.snapshot.queryParamMap.get('b');
    if (typeof b === 'string') {
      next = b.startsWith('/') ? b : `/${b}`;
    } else {
      next = this.homeUrl;
    }
    this.router.navigate([next]).catch(e => console.error(e));
  }


  private normalizeBackUrl(url: string | undefined): string | undefined {
    if (url === undefined) {
      return undefined;
    }
    if (url === this.homeUrl) {
      return undefined;
    }
    if (url.startsWith(this.loginUrl)) {
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
