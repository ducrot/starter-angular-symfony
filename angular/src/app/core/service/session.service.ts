import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {User} from '@data/schema/user';
import {LoginSuccess} from '@data/schema/login-success';
import {jsonDateParse} from '@app/lib/json-date';


@Injectable({
  providedIn: 'root'
})
export class SessionService {


  readonly user$: Observable<User>;


  get user(): User | undefined {
    const sess = this.readSession();
    return sess ? sess.user : undefined;
  }


  get state(): 'empty' | 'valid' | 'expired' {
    const sess = this.readSession();
    if (!sess) {
      return 'empty';
    }
    if (this.willSessionExpireSoon(sess)) {
      return 'expired';
    }
    return 'valid';
  }


  get token(): string | undefined {
    const sess = this.readSession();
    return sess ? sess.token : undefined;
  }


  // we want to prevent the user from entering a route *before* his token expires
  private readonly sessionEagerExpirationSeconds = 10;
  private readonly sessionKey = 'user_session';
  private readonly userSubject = new ReplaySubject<User>(1);


  constructor() {
    this.user$ = this.userSubject;
    const sess = this.readSession();
    if (sess) {
      this.userSubject.next(sess.user);
    }
  }


  acceptSession(session: LoginSuccess): void {
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    this.userSubject.next(session.user);
  }


  destroySession(): void {
    localStorage.removeItem(this.sessionKey);
  }


  private willSessionExpireSoon(session: LoginSuccess): boolean {
    const nowTs = Date.now();
    const expirationTs = jsonDateParse(session.tokenExpiresAt).getTime();
    return (expirationTs - 1000 * this.sessionEagerExpirationSeconds) < nowTs;
  }


  private readSession(): LoginSuccess | undefined {
    const json = localStorage.getItem(this.sessionKey);
    if (typeof json === 'string') {
      return JSON.parse(json) as LoginSuccess;
    }
    return undefined;
  }


}
