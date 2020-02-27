import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDonkeyComponent } from './error-donkey.component';

describe('ErrorDonkeyComponent', () => {
  let component: ErrorDonkeyComponent;
  let fixture: ComponentFixture<ErrorDonkeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorDonkeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorDonkeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
