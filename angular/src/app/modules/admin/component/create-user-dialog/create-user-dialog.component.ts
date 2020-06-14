import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { USER_MAN_SERVICE } from '@modules/admin/service-tokens';
import { UserManagementService } from '@pb/app/user-management-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceError } from '@app/interceptor/service-error.interceptor';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserDialogComponent {

  readonly formGroup: FormGroup;

  constructor(
    fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
    public snackBar: MatSnackBar,
    @Inject(USER_MAN_SERVICE) private readonly service: UserManagementService
  ) {

    this.formGroup = fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      isAdmin: [false, Validators.required],
    });

  }


  getErrorMessage() {
    // this.formGroup.controls['username'].errors.
    return this.formGroup.get('username')?.hasError('required') ? 'You must enter a value' : null;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  async onSubmitClick(): Promise<void> {
    if (this.formGroup.invalid) {
      this.snackBar.open('Please fix the form');
      return;
    }
    try {
      const response = await this.service.create({
        username: this.formGroup.value.username,
        password: this.formGroup.value.password,
        isAdmin: this.formGroup.value.isAdmin,
      });
      this.dialogRef.close(response.user);
    } catch (e) {
      if (e instanceof ServiceError) {
        this.snackBar.open(e.message);
      }
    }
  }

}
