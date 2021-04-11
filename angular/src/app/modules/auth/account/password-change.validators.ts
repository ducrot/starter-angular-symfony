import { FormGroup } from '@angular/forms';

export class PasswordChangeValidators {

  static newPasswordIsEqualCurrentPassword(group: FormGroup) {
    if (group.controls.currentPassword.value === group.controls.newPassword.value) {
      group.controls.newPassword.setErrors({newPasswordIsEqualCurrentPassword: true});
    }
    return null;
  }

  static newPasswordNotEqualConfirmPassword(group: FormGroup) {
    if (group.controls.newPassword.value !== group.controls.newPasswordConfirm.value) {
      group.controls.newPasswordConfirm.setErrors({newPasswordNotEqualConfirmPassword: true});
    }
    return null;
  }
}
