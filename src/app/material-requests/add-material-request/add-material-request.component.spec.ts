import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialRequestComponent } from './add-material-request.component';

describe('AddMaterialRequestComponent', () => {
  let component: AddMaterialRequestComponent;
  let fixture: ComponentFixture<AddMaterialRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMaterialRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMaterialRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
