import { TestBed } from '@angular/core/testing';

import { SessionRequired } from './session-required.service';

describe('SessionRequired', () => {
  let guard: SessionRequired;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SessionRequired);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
