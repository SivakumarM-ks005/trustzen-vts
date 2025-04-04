import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierInformationComponent } from './supplier-information.component';

describe('SupplierInformationComponent', () => {
  let component: SupplierInformationComponent;
  let fixture: ComponentFixture<SupplierInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SupplierInformationComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SupplierInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
