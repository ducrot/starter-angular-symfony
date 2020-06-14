import { InjectionToken } from '@angular/core';
import { UserManagementService } from '@pb/app/user-management-service';

export const USER_MAN_SERVICE = new InjectionToken<UserManagementService>('User management service');
