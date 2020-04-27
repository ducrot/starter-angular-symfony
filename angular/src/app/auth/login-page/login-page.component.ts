import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthenticationClient} from '@app/service/authentication-client.service';
import {SessionService} from '@app/service/session.service';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationRoutingService} from '@app/service/authentication-routing.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ServiceError} from '@app/interceptor/service-error.interceptor';
import {AlertService} from '@shared/service/alert.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent implements OnInit, AfterViewInit {

  readonly formGroup: FormGroup;

  constructor(
    private readonly authClient: AuthenticationClient,
    private readonly session: SessionService,
    private readonly routing: AuthenticationRoutingService,
    private readonly route: ActivatedRoute,
    fb: FormBuilder,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {
    this.formGroup = fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }


  ngOnInit(): void {
    // always destroy session when the page is opened
    this.session.destroySession();
  }


  ngAfterViewInit(): void {
    if (this.route.snapshot.queryParamMap.get('expired') === 'true') {
      this.alertService.warning('Your session has expired. Please login again.');
      this.cdr.detectChanges();
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
          if (error instanceof ServiceError) {
            this.alertService.error(error.message);
          } else {
            this.alertService.error('Unknown error: ' + error);
          }
          this.cdr.detectChanges();
        }
      );
  }

}
