import { UntypedFormGroup } from '@angular/forms';

export class PasswordChangeValidators {

  static newPasswordIsEqualCurrentPassword(group: UntypedFormGroup): null {
    if (group.controls.currentPassword.value === group.controls.newPassword.value) {
      group.controls.newPassword.setErrors({newPasswordIsEqualCurrentPassword: true});
    }
    return null;
  }

  static newPasswordNotEqualConfirmPassword(group: UntypedFormGroup): null {
    if (group.controls.newPassword.value !== group.controls.newPasswordConfirm.value) {
      group.controls.newPasswordConfirm.setErrors({newPasswordNotEqualConfirmPassword: true});
    }
    return null;
  }
}
