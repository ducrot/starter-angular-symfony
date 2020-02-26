import { TestBed } from '@angular/core/testing';

import { AuthenticationRoutingService } from './authentication-routing.service';

describe('AuthenticationRoutingService', () => {
  let service: AuthenticationRoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
