import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {SessionService} from "./session.service";
import {AuthenticationRoutingService} from "./authentication-routing.service";

@Injectable({
  providedIn: 'root'
})
export class SessionRequired implements CanActivate, CanActivateChild {


  constructor(private readonly session: SessionService, private readonly routing: AuthenticationRoutingService) {
  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    switch (this.session.state) {
      case "empty":
        console.error(`Not authenticated. Cannot navigate to "${state.url}".`);
        this.session.destroySession();
        this.routing.onNotAuthenticated(state.url);
        return false;

      case "expired":
        console.error(`Session expired. Cannot navigate to "${state.url}".`);
        this.session.destroySession();
        this.routing.onSessionExpired(state.url);
        return false;

      case "valid":
        return true;
    }
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

}
