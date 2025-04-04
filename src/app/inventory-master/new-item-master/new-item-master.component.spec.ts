import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItemMasterComponent } from './new-item-master.component';

describe('NewItemMasterComponent', () => {
  let component: NewItemMasterComponent;
  let fixture: ComponentFixture<NewItemMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewItemMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewItemMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
