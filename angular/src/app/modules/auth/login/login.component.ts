import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from '@app/service/auth.service';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationRoutingService} from '@app/service/authentication-routing.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '@shared/service/alert.service';
import {HeaderService} from '@shared/service/header.service';
import {ConstantsService} from '@app/service/constants.service';
import {ThemeService} from '@app/service/theme.service';
import {Logger} from '@app/service/logger.service';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationServiceClient} from '@pb/app/authentication-service';


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
    private readonly client: AuthenticationServiceClient,
    private readonly authService: AuthService,
    private readonly routing: AuthenticationRoutingService,
    private readonly route: ActivatedRoute,
    fb: FormBuilder,
    private alertService: AlertService,
    private constants: ConstantsService,
    private headerService: HeaderService,
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
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
      this.translate.get('session_expired').subscribe((res: string) => {
        this.alertService.warning(res);
      });
    }

    // Select logo for dark/light mode
    this.themeService.getDarkTheme().subscribe(theme => {
      this.logo = (theme) ? 'assets/logo.svg' : 'assets/logo.svg';
      this.cdr.markForCheck();
    });
  }


  async onSubmit(): Promise<void> {
    // reset alerts on submit
    this.alertService.clear();

    try {

      const {response} = await this.client.login({
        username: this.formGroup.value.username,
        password: this.formGroup.value.password
      });

      this.authService.acceptSession(response);
      this.routing.onLoginSuccess(this.route);

    } catch (error) {
      this.alertService.error(error.message ?? error);
      this.cdr.markForCheck();
    }

  }

}
