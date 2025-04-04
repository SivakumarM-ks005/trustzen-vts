import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAssignCategoryEntityComponent } from './dialog-assign-category-entity.component';

describe('DialogAssignCategoryEntityComponent', () => {
  let component: DialogAssignCategoryEntityComponent;
  let fixture: ComponentFixture<DialogAssignCategoryEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DialogAssignCategoryEntityComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DialogAssignCategoryEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
