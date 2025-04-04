import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierDirectoryActionComponent } from './supplier-directory-action.component';

describe('SupplierDirectoryActionComponent', () => {
  let component: SupplierDirectoryActionComponent;
  let fixture: ComponentFixture<SupplierDirectoryActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierDirectoryActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierDirectoryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
