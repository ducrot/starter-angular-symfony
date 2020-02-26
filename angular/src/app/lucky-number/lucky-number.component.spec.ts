import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuckyNumberComponent } from './lucky-number.component';

describe('LuckyNumberComponent', () => {
  let component: LuckyNumberComponent;
  let fixture: ComponentFixture<LuckyNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuckyNumberComponent ]
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
