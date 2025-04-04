import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcingEventsComponent } from './sourcing-events.component';

describe('SourcingEventsComponent', () => {
  let component: SourcingEventsComponent;
  let fixture: ComponentFixture<SourcingEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourcingEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourcingEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
