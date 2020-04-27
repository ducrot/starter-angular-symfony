import { TestBed } from '@angular/core/testing';

import { SessionRequired } from './session-required.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('SessionRequired', () => {
  let guard: SessionRequired;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ]
    });
    guard = TestBed.inject(SessionRequired);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
