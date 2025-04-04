import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClauseLibraryComponent } from './edit-clause-library.component';

describe('EditClauseLibraryComponent', () => {
  let component: EditClauseLibraryComponent;
  let fixture: ComponentFixture<EditClauseLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EditClauseLibraryComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(EditClauseLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
