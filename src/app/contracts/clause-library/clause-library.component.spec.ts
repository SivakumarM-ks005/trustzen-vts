import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClauseLibraryComponent } from './clause-library.component';

describe('ClauseLibraryComponent', () => {
  let component: ClauseLibraryComponent;
  let fixture: ComponentFixture<ClauseLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ClauseLibraryComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ClauseLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
