import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSupplierComponent } from './assign-supplier.component';

describe('AssignSupplierComponent', () => {
  let component: AssignSupplierComponent;
  let fixture: ComponentFixture<AssignSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignSupplierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
