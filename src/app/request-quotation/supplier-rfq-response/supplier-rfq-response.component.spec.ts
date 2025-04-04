import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierRfqResponseComponent } from './supplier-rfq-response.component';

describe('SupplierRfqResponseComponent', () => {
  let component: SupplierRfqResponseComponent;
  let fixture: ComponentFixture<SupplierRfqResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierRfqResponseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierRfqResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
