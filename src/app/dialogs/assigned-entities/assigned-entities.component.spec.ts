import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedEntitiesComponent } from './assigned-entities.component';

describe('AssignedEntitiesComponent', () => {
  let component: AssignedEntitiesComponent;
  let fixture: ComponentFixture<AssignedEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedEntitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
