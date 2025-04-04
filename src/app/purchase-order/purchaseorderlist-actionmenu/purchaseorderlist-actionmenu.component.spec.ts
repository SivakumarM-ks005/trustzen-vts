import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseorderlistActionmenuComponent } from './purchaseorderlist-actionmenu.component';

describe('PurchaseorderlistActionmenuComponent', () => {
  let component: PurchaseorderlistActionmenuComponent;
  let fixture: ComponentFixture<PurchaseorderlistActionmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseorderlistActionmenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseorderlistActionmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
