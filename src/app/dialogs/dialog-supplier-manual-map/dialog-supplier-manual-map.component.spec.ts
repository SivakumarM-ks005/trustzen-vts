import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSupplierManualMapComponent } from './dialog-supplier-manual-map.component';

describe('DialogSupplierManualMapComponent', () => {
  let component: DialogSupplierManualMapComponent;
  let fixture: ComponentFixture<DialogSupplierManualMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DialogSupplierManualMapComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DialogSupplierManualMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
