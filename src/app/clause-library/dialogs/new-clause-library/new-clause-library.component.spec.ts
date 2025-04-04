import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewClauseLibraryComponent } from './new-clause-library.component';

describe('NewClauseLibraryComponent', () => {
  let component: NewClauseLibraryComponent;
  let fixture: ComponentFixture<NewClauseLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NewClauseLibraryComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(NewClauseLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
