import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorPageLayoutComponent } from './error-page-layout.component';

describe('ErrorPageLayoutComponent', () => {
  let component: ErrorPageLayoutComponent;
  let fixture: ComponentFixture<ErrorPageLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorPageLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
