import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialIssueNotesComponent } from './material-issue-notes.component';

describe('MaterialIssueNotesComponent', () => {
  let component: MaterialIssueNotesComponent;
  let fixture: ComponentFixture<MaterialIssueNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialIssueNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialIssueNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
