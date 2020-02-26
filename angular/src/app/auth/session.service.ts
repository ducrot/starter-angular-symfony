import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../../lib/api/user";
import {LoginSuccess} from "../../lib/api/login-success";
import {jsonDateParse} from "../../lib/json-date";


@Injectable({
  providedIn: 'root'
})
export class SessionService {


  // TODO
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


  private readonly sessionExpirationLeewaySeconds = 5;


  constructor() {
  }


  acceptSession(session: LoginSuccess): void {
    localStorage.setItem('user_session', JSON.stringify(session));
  }


  destroySession(): void {
    localStorage.removeItem('user_session');
  }


  private willSessionExpireSoon(session: LoginSuccess): boolean {
    const nowTs = Date.now();
    const expirationTs = jsonDateParse(session.tokenExpiresAt).getTime();
    return (expirationTs - 1000 * this.sessionExpirationLeewaySeconds) < nowTs;
  }


  private readSession(): LoginSuccess | undefined {
    const json = localStorage.getItem('user_session');
    if (typeof json === 'string') {
      return JSON.parse(json) as LoginSuccess;
    }
    return undefined;
  }


}
