import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '@app/service/auth.service';
import { User } from '@pb/app/user';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { PasswordChangeValidators } from '@modules/auth/account/password-change.validators';
import { AuthenticationServiceClient } from '@pb/app/authentication-service';
import { AlertService } from '@shared/service/alert.service';
import { Logger } from '@app/service/logger.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { MatAccordion } from '@angular/material/expansion';

const log = new Logger('LoginComponent');

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent {

  readonly user$: Observable<User>;
  panelOpenState = false;
  readonly formGroup: FormGroup;

  @ViewChild('changePasswordAccordion') changePasswordAccordion: MatAccordion;
  @ViewChild('changePasswordForm') changePasswordForm: NgForm;

  constructor(
    private readonly authService: AuthService,
    private readonly client: AuthenticationServiceClient,
    private alertService: AlertService,
    fb: FormBuilder,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
  ) {
    this.user$ = this.authService.user$;

    this.formGroup = fb.group({
      currentPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
      newPasswordConfirm: [null, Validators.required],
    }, {
      validator: Validators.compose([
        PasswordChangeValidators.newPasswordIsEqualCurrentPassword,
        PasswordChangeValidators.newPasswordNotEqualConfirmPassword
      ])
    });
  }

  get currentPassword() {
    return this.formGroup.get('currentPassword');
  }

  get newPassword() {
    return this.formGroup.get('newPassword');
  }

  get newPasswordConfirm() {
    return this.formGroup.get('newPasswordConfirm');
  }

  async onSubmit(): Promise<void> {
    // reset alerts on submit
    this.alertService.clear();

    try {
      const {response} = await this.client.changePassword({
        currentPassword: this.currentPassword?.value,
        newPassword: this.newPassword?.value,
        newPasswordConfirm: this.newPasswordConfirm?.value
      });

      log.debug('AuthenticationServiceClient.changePassword', response);

      if (response.valid) {
        this.changePasswordAccordion.closeAll();
        this.changePasswordForm.resetForm();
        this.translate.get('app.auth.account.password_changed').subscribe((res: string) => {
          this.snackBar.open(res);
        });
      }

    } catch (error) {
      this.alertService.error(error.message ?? error);
    }
    this.cdr.markForCheck();
  }
}
