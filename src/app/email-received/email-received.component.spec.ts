import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailReceivedComponent } from './email-received.component';

describe('EmailReceivedComponent', () => {
  let component: EmailReceivedComponent;
  let fixture: ComponentFixture<EmailReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailReceivedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
