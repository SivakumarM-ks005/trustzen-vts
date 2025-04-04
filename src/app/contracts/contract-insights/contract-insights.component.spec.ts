import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractInsightsComponent } from './contract-insights.component';

describe('ContractInsightsComponent', () => {
  let component: ContractInsightsComponent;
  let fixture: ComponentFixture<ContractInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ContractInsightsComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ContractInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
