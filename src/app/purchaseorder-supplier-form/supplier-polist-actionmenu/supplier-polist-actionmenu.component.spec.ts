import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPolistActionmenuComponent } from './supplier-polist-actionmenu.component';

describe('SupplierPolistActionmenuComponent', () => {
  let component: SupplierPolistActionmenuComponent;
  let fixture: ComponentFixture<SupplierPolistActionmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierPolistActionmenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierPolistActionmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
