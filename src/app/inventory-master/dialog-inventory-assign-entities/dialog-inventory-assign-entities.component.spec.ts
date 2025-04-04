import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInventoryAssignEntitiesComponent } from './dialog-inventory-assign-entities.component';

describe('DialogInventoryAssignEntitiesComponent', () => {
  let component: DialogInventoryAssignEntitiesComponent;
  let fixture: ComponentFixture<DialogInventoryAssignEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogInventoryAssignEntitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogInventoryAssignEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
