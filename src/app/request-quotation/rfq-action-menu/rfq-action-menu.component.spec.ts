import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqActionMenuComponent } from './rfq-action-menu.component';

describe('RfqActionMenuComponent', () => {
  let component: RfqActionMenuComponent;
  let fixture: ComponentFixture<RfqActionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfqActionMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
