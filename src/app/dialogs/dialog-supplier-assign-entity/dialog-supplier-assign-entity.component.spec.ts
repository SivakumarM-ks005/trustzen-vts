import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSupplierAssignEntityComponent } from './dialog-supplier-assign-entity.component';

describe('DialogSupplierAssignEntityComponent', () => {
  let component: DialogSupplierAssignEntityComponent;
  let fixture: ComponentFixture<DialogSupplierAssignEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DialogSupplierAssignEntityComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DialogSupplierAssignEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
