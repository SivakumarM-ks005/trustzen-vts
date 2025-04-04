import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierFormPreviewComponent } from './supplier-form-preview.component';

describe('SupplierFormPreviewComponent', () => {
  let component: SupplierFormPreviewComponent;
  let fixture: ComponentFixture<SupplierFormPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SupplierFormPreviewComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SupplierFormPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
