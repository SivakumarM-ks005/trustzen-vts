import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierRfqRegretComponent } from './supplier-rfq-regret.component';

describe('SupplierRfqRegretComponent', () => {
  let component: SupplierRfqRegretComponent;
  let fixture: ComponentFixture<SupplierRfqRegretComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierRfqRegretComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierRfqRegretComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
