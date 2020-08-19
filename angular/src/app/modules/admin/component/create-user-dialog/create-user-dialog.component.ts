import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserManagementServiceClient } from '@pb/app/user-management-service';

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
    private readonly client: UserManagementServiceClient
  ) {

    this.formGroup = fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      isAdmin: [false, Validators.required],
    });

  }


  getErrorMessage() {
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
      const {responseMessage} = await this.client.create({
        username: this.formGroup.value.username,
        password: this.formGroup.value.password,
        isAdmin: this.formGroup.value.isAdmin,
      });
      this.dialogRef.close(responseMessage.user);
    } catch (e) {
      this.snackBar.open(e.message);
    }
  }

}
