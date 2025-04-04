import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowPqScoreCardComponent } from './workflow-pq-score-card.component';

describe('WorkflowPqScoreCardComponent', () => {
  let component: WorkflowPqScoreCardComponent;
  let fixture: ComponentFixture<WorkflowPqScoreCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowPqScoreCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowPqScoreCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
