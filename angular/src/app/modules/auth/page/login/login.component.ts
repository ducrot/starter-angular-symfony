import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@app/service/auth.service';
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
import { ThemeService } from '@app/service/theme.service';
import { Logger } from '@app/service/logger.service';

const log = new Logger('LoginComponent');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  public companyName: string;
  public title: string;
  public logo: string;
  readonly formGroup: FormGroup;

  constructor(
    @Inject(AUTH_SERVICE) private readonly authenticationService: AuthenticationService,
    private readonly authService: AuthService,
    private readonly routing: AuthenticationRoutingService,
    private readonly route: ActivatedRoute,
    fb: FormBuilder,
    private alertService: AlertService,
    private constants: ConstantsService,
    private headerService: HeaderService,
    private themeService: ThemeService,
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
    this.authService.destroySession();

    // Show alert if session is expired
    if (this.route.snapshot.queryParamMap.get('expired') === 'true') {
      this.alertService.warning('Your session has expired. Please login again.');
    }

    // Select logo for dark/light mode
    this.themeService.getDarkTheme().subscribe(theme => {
      this.logo = (theme) ? 'assets/logo-negative.svg' : 'assets/logo.svg';
      this.cdr.markForCheck();
    });
  }


  async onSubmit(): Promise<void> {
    // reset alerts on submit
    this.alertService.clear();

    try {

      const response = await this.authenticationService.login({
        username: this.formGroup.value.username,
        password: this.formGroup.value.password
      });

      log.debug('authenticationService.login', response);
      this.authService.acceptSession(response);
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
