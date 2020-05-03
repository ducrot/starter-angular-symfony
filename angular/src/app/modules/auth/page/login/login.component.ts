import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthenticationClient} from '@app/service/authentication-client.service';
import {SessionService} from '@app/service/session.service';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationRoutingService} from '@app/service/authentication-routing.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ServiceError} from '@app/interceptor/service-error.interceptor';
import {AlertService} from '@shared/service/alert.service';
import {HeaderService} from '@shared/service/header.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  readonly formGroup: FormGroup;

  constructor(
    private readonly authClient: AuthenticationClient,
    private readonly session: SessionService,
    private readonly routing: AuthenticationRoutingService,
    private readonly route: ActivatedRoute,
    fb: FormBuilder,
    private alertService: AlertService,
    private headerService: HeaderService,
    private cdr: ChangeDetectorRef
  ) {
    this.headerService.setTitle('Login');

    this.formGroup = fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }


  ngOnInit(): void {
    // always destroy session when the page is opened
    this.session.destroySession();

    // Show alert if session is expired
    if (this.route.snapshot.queryParamMap.get('expired') === 'true') {
      this.alertService.warning('Your session has expired. Please login again.');
    }
  }


  onSubmit(): void {
    // reset alerts on submit
    this.alertService.clear();

    this.authClient.login({
      username: this.formGroup.value.username,
      password: this.formGroup.value.password
    })
      .subscribe(
        val => {
          this.session.acceptSession(val);
          this.routing.onLoginSuccess(this.route);
        },
        error => {
          if (error instanceof ServiceError || error instanceof HttpErrorResponse) {
            this.alertService.error(error.message);
          } else {
            this.alertService.error('Unknown error: ' + error);
            console.log(error);
          }
          this.cdr.markForCheck();
        }
      );
  }

}
