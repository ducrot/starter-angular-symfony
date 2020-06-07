import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { SessionService } from '@app/service/session.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationRoutingService } from '@app/service/authentication-routing.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceError } from '@app/interceptor/service-error.interceptor';
import { AlertService } from '@shared/service/alert.service';
import { HeaderService } from '@shared/service/header.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AUTH_SERVICE } from '@shared/service-tokens';
import { AuthenticationService } from '@pb/app/authentication-service';
import { ConstantsService } from '@app/service/constants.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  companyName: string;
  title: string;
  readonly formGroup: FormGroup;

  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthenticationService,
    private readonly session: SessionService,
    private readonly routing: AuthenticationRoutingService,
    private readonly route: ActivatedRoute,
    fb: FormBuilder,
    private alertService: AlertService,
    private constants: ConstantsService,
    private headerService: HeaderService,
    private cdr: ChangeDetectorRef
  ) {
    this.companyName = this.constants.companyName;
    this.title = 'Login';
    this.headerService.setTitle(this.title);

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


  async onSubmit(): Promise<void> {
    // reset alerts on submit
    this.alertService.clear();

    try {

      const response = await this.authService.login({
        username: this.formGroup.value.username,
        password: this.formGroup.value.password
      });

      this.session.acceptSession(response);
      this.routing.onLoginSuccess(this.route);

    } catch (error) {
      if (error instanceof ServiceError || error instanceof HttpErrorResponse) {
        this.alertService.error(error.message);
      } else {
        this.alertService.error('Unknown error: ' + error);
        console.log(error);
      }
      this.cdr.markForCheck();
    }

  }

}
