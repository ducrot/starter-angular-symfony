import { TestBed } from '@angular/core/testing';

import { AuthenticationInterceptor } from './authentication.interceptor';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthenticationInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthenticationInterceptor
    ],
    imports: [
      RouterTestingModule
    ]
  }));

  it('should be created', () => {
    const interceptor: AuthenticationInterceptor = TestBed.inject(AuthenticationInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
