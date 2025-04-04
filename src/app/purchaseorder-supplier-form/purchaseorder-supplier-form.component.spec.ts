import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseorderSupplierFormComponent } from './purchaseorder-supplier-form.component';

describe('PurchaseorderSupplierFormComponent', () => {
  let component: PurchaseorderSupplierFormComponent;
  let fixture: ComponentFixture<PurchaseorderSupplierFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseorderSupplierFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseorderSupplierFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
