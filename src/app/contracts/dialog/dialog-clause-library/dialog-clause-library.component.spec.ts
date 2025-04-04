import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogClauseLibraryComponent } from './dialog-clause-library.component';

describe('DialogClauseLibraryComponent', () => {
  let component: DialogClauseLibraryComponent;
  let fixture: ComponentFixture<DialogClauseLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DialogClauseLibraryComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DialogClauseLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
