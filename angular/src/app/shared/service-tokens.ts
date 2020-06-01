import {InjectionToken} from "@angular/core";
import {TestService} from "../../pb/app/test-service";
import {AuthenticationService} from "../../pb/app/authentication-service";

export const TEST_SERVICE = new InjectionToken<TestService>('Test service');
export const AUTH_SERVICE = new InjectionToken<AuthenticationService>('Authentication service');
