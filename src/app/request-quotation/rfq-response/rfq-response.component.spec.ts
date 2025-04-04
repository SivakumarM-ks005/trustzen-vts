import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqResponseComponent } from './rfq-response.component';

describe('RfqResponseComponent', () => {
  let component: RfqResponseComponent;
  let fixture: ComponentFixture<RfqResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfqResponseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
