import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowApprovalComponent } from './work-flow-approval.component';

describe('WorkFlowApprovalComponent', () => {
  let component: WorkFlowApprovalComponent;
  let fixture: ComponentFixture<WorkFlowApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkFlowApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkFlowApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
