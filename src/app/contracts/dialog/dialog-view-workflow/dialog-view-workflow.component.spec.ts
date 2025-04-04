import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogViewWorkflowComponent } from './dialog-view-workflow.component';

describe('DialogViewWorkflowComponent', () => {
  let component: DialogViewWorkflowComponent;
  let fixture: ComponentFixture<DialogViewWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogViewWorkflowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogViewWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
