import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@app/service/auth.service';
import { AuthenticationRoutingService } from '../service/authentication-routing.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {


  constructor(
    private readonly authService: AuthService,
    private readonly routing: AuthenticationRoutingService,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    switch (this.authService.state) {
      case 'empty':
        console.error(`Not authenticated. Cannot navigate to "${state.url}".`);
        this.authService.destroySession();
        this.routing.onNotAuthenticated(state.url);
        return false;

      case 'expired':
        console.error(`Session expired. Cannot navigate to "${state.url}".`);
        this.authService.destroySession();
        this.routing.onSessionExpired(state.url);
        return false;

      case 'valid':
        return true;
    }
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

}
