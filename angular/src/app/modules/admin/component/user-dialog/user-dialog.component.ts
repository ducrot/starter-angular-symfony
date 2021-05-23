import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Gender } from '@pb/app/gender';
import { User } from '@pb/app/user';
import { CreateUserRequest, UpdateUserRequest } from '@pb/app/user-management-service';
import { UserManagementServiceClient } from '@pb/app/user-management-service.client';
import { TranslateService } from '@ngx-translate/core';
import { Logger } from '@app/service/logger.service';

const log = new Logger('UserDialogComponent');

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDialogComponent {

  action: string;
  dialogTitle!: string;
  readonly formGroup: FormGroup;
  readonly gender = Gender;
  private user!: User;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private readonly client: UserManagementServiceClient,
  ) {

    this.action = data.action;

    if (this.action === 'update') {
      this.user = data.user;
      this.dialogTitle = 'app.admin.users.update';
    } else if (this.action === 'create') {
      this.user = User.fromJson({
        id: '',
        username: '',
        gender: this.gender.NONE,
        firstName: '',
        lastName: '',
        isAdmin: false,
      });
      this.dialogTitle = 'app.admin.users.create';
    }

    this.formGroup = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      username: [this.user.username, [Validators.required, Validators.email]],
      password: ['', (this.action === 'create') ? Validators.required : null],
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      gender: [this.user.gender, Validators.required],
      isAdmin: [this.user.isAdmin],
    });
  }

  async onCreateSubmitClick(): Promise<void> {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.translate.get('app.form.error').subscribe((res: string) => {
        this.snackBar.open(res);
      });
      return;
    }
    try {
      const request: CreateUserRequest = {
        username: this.formGroup.value.username,
        password: this.formGroup.value.password,
        firstName: this.formGroup.value.firstName,
        lastName: this.formGroup.value.lastName,
        gender: this.formGroup.value.gender,
        isAdmin: this.formGroup.value.isAdmin,
      };
      log.debug('onCreateSubmitClick request', request);
      const {response} = await this.client.create(request);
      log.debug('onCreateSubmitClick response', response);
      this.dialogRef.close(response.user);
    } catch (e) {
      this.snackBar.open(e.message);
    }
  }

  async onUpdateSubmitClick(): Promise<void> {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.translate.get('app.form.error').subscribe((res: string) => {
        this.snackBar.open(res);
      });
      return;
    }
    try {
      const request: UpdateUserRequest = {
        id: this.user.id,
        username: this.formGroup.value.username,
        // ToDo: Change password
        password: '',
        passwordRepeat: '',
        passwordConfirmation: '',
        roles: this.user.roles,
        firstName: this.formGroup.value.firstName,
        lastName: this.formGroup.value.lastName,
        gender: this.formGroup.value.gender,
        isAdmin: this.formGroup.value.isAdmin,
      };
      log.debug('onUpdateSubmitClick request', request);
      const {response} = await this.client.update(request);
      log.debug('onUpdateSubmitClick response', response);
      this.dialogRef.close(response.user);
    } catch (e) {
      this.snackBar.open(e.message);
    }
  }

}
