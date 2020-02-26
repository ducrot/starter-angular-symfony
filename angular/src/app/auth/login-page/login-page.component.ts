import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthenticationClient} from "../../../lib/api/authentication-client.service";
import {SessionService} from "../session.service";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AuthenticationRoutingService} from "../authentication-routing.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent implements OnInit {


  sessionExpired$: Observable<boolean>;

  readonly formGroup: FormGroup;

  constructor(
    private readonly authClient: AuthenticationClient,
    private readonly session: SessionService,
    private readonly routing: AuthenticationRoutingService,
    private readonly route: ActivatedRoute,
    fb: FormBuilder
  ) {

    this.formGroup = fb.group({
      'username': [null, Validators.required],
      'password': [null, Validators.required],
    });

    this.sessionExpired$ = route.queryParamMap.pipe(
      map(p => p.get('expired') === 'true')
    );

  }


  ngOnInit(): void {
    // always destroy session when the page is opened
    this.session.destroySession();
  }


  onSubmit(): void {

    this.authClient.login({
      username: this.formGroup.value.username,
      password: this.formGroup.value.password
    }).subscribe(
      val => {
        this.session.acceptSession(val);
        this.routing.afterLoginSuccess(this.route);
      },
      error => console.error(error)
    );

  }


}
