import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerBiReportsComponent } from './power-bi-reports.component';

describe('PowerBiReportsComponent', () => {
  let component: PowerBiReportsComponent;
  let fixture: ComponentFixture<PowerBiReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerBiReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerBiReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
