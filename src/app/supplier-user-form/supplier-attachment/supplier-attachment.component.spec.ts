import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAttachmentComponent } from './supplier-attachment.component';

describe('SupplierAttachmentComponent', () => {
  let component: SupplierAttachmentComponent;
  let fixture: ComponentFixture<SupplierAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SupplierAttachmentComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SupplierAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
