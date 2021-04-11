import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { User } from '@pb/app/user';
import { LoginResponse } from '@pb/app/authentication-service';
import { Timestamp } from '@pb/google/protobuf/timestamp';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  readonly user$: Observable<User>;
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

  get isAuthenticated(): boolean {
    return this.state === 'valid';
  }

  get isAdmin(): boolean {
    return this.user ? this.user.isAdmin : false;
  }

  acceptSession(session: LoginResponse): void {
    if (session.user === undefined) {
      throw new Error('Missing user');
    }
    if (session.token === undefined) {
      throw new Error('Missing token');
    }
    if (session.tokenExpiresAt === undefined) {
      throw new Error('Missing tokenExpiresAt');
    }
    const jsonStr = LoginResponse.toJsonString(session);
    localStorage.setItem(this.sessionKey, jsonStr);
    this.userSubject.next(session.user);
  }


  destroySession(): void {
    localStorage.removeItem(this.sessionKey);
  }


  private willSessionExpireSoon(session: LoginResponse): boolean {
    if (session.tokenExpiresAt === undefined) {
      throw new Error('Missing tokenExpiresAt');
    }
    const nowTs = Date.now();
    const expirationTs = Timestamp.toDate(session.tokenExpiresAt).getTime();
    return (expirationTs - 1000 * this.sessionEagerExpirationSeconds) < nowTs;
  }


  private readSession(): LoginResponse | undefined {
    const jsonStr = localStorage.getItem(this.sessionKey);
    if (typeof jsonStr === 'string') {
      return LoginResponse.fromJsonString(jsonStr);
    }
    return undefined;
  }


}
