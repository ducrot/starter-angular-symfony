import { TestBed } from '@angular/core/testing';

import { AuthenticationRoutingService } from './authentication-routing.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthenticationRoutingService', () => {
  let service: AuthenticationRoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ]
    });
    service = TestBed.inject(AuthenticationRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
