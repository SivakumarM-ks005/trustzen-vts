import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRfqCancelComponent } from './dialog-rfq-cancel.component';

describe('DialogRfqCancelComponent', () => {
  let component: DialogRfqCancelComponent;
  let fixture: ComponentFixture<DialogRfqCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogRfqCancelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogRfqCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
