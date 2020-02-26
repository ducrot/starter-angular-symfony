import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';


/**
 * A resolve is used to resolve route-data like "resolve" in angular js / ui-router.
 *
 * Unfortunately, they cannot be created in the route declaration.
 *
 * This resolver just adds a simple delay.
 */

@Injectable({
  providedIn: 'root',
})
export class DelayResolverService implements Resolve<string> {
  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> | Observable<never> {
    return of("xxx").pipe(
      delay(700)
    );
  }


}
