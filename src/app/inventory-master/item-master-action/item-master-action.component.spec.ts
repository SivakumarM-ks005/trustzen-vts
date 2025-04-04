import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMasterActionComponent } from './item-master-action.component';

describe('ItemMasterActionComponent', () => {
  let component: ItemMasterActionComponent;
  let fixture: ComponentFixture<ItemMasterActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemMasterActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemMasterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
