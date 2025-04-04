import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryScopeManagementComponent } from './category-scope-management.component';

describe('CategoryScopeManagementComponent', () => {
  let component: CategoryScopeManagementComponent;
  let fixture: ComponentFixture<CategoryScopeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CategoryScopeManagementComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CategoryScopeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
