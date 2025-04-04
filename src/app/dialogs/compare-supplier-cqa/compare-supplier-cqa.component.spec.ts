import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareSupplierCqaComponent } from './compare-supplier-cqa.component';

describe('CompareSupplierCqaComponent', () => {
  let component: CompareSupplierCqaComponent;
  let fixture: ComponentFixture<CompareSupplierCqaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareSupplierCqaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareSupplierCqaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
