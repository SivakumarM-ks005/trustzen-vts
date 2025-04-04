import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCategoryEntityComponent } from './assign-category-entity.component';

describe('AssignCategoryEntityComponent', () => {
  let component: AssignCategoryEntityComponent;
  let fixture: ComponentFixture<AssignCategoryEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AssignCategoryEntityComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(AssignCategoryEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
