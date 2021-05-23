import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LuckyNumberComponent } from './lucky-number.component';
import { HttpClientModule } from '@angular/common/http';

describe('LuckyNumberComponent', () => {
  let component: LuckyNumberComponent;
  let fixture: ComponentFixture<LuckyNumberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LuckyNumberComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuckyNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
