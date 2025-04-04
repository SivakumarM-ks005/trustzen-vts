import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierRfqActionMenuComponent } from './supplier-rfq-action-menu.component';

describe('SupplierRfqActionMenuComponent', () => {
  let component: SupplierRfqActionMenuComponent;
  let fixture: ComponentFixture<SupplierRfqActionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierRfqActionMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierRfqActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
