import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthenticationClient} from "../../../lib/api/authentication-client.service";
import {TestClient} from "../../../lib/api/test-client.service";
import {SessionService} from "../session.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent implements OnInit {


  sessionExpired$: Observable<boolean>;


  constructor(
    private readonly authClient: AuthenticationClient,
    private readonly session: SessionService,
    private readonly testClient: TestClient,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {


    this.sessionExpired$ = route.queryParamMap.pipe(
      map(p => p.get('expired') === 'true')
    );

  }


  ngOnInit(): void {
    // always destroy session when the login page is opened
    this.session.destroySession();
  }


  login() {

    this.authClient.login({
      username: 'max',
      password: 'muster'
    }).subscribe(
      val => {

        this.session.acceptSession(val);

        const backUrl = '/' + (this.route.snapshot.queryParamMap.get('backUrl') ?? '');
        this.router.navigate([backUrl]).catch(e => console.error(e));

        this.testClient.luckyNumber().subscribe(v => console.log(v))

      },
      error => console.error(error)
    );

  }

}
