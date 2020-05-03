import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDonkeyComponent } from './error-donkey.component';
import { HttpClientModule } from '@angular/common/http';

describe('ErrorDonkeyComponent', () => {
  let component: ErrorDonkeyComponent;
  let fixture: ComponentFixture<ErrorDonkeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorDonkeyComponent ],
      imports: [ HttpClientModule ]
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
