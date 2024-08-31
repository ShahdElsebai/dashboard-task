import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastErrorComponent } from './toast-error.component';

describe('ToastErrorComponent', () => {
  let component: ToastErrorComponent;
  let fixture: ComponentFixture<ToastErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToastErrorComponent]
    });
    fixture = TestBed.createComponent(ToastErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
