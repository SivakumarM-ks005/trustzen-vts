import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClauseLibraryListComponent } from './clause-library-list.component';

describe('ClauseLibraryListComponent', () => {
  let component: ClauseLibraryListComponent;
  let fixture: ComponentFixture<ClauseLibraryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ClauseLibraryListComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ClauseLibraryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
