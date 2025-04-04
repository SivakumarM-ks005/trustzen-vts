import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpurchaseOrderListComponent } from './addpurchase-order-list.component';

describe('AddpurchaseOrderListComponent', () => {
  let component: AddpurchaseOrderListComponent;
  let fixture: ComponentFixture<AddpurchaseOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddpurchaseOrderListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddpurchaseOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
