import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfxInsightsComponent } from './rfx-insights.component';

describe('RfxInsightsComponent', () => {
  let component: RfxInsightsComponent;
  let fixture: ComponentFixture<RfxInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfxInsightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfxInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
