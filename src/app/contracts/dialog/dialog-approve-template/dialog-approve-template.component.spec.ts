import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogApproveTemplateComponent } from './dialog-approve-template.component';

describe('DialogApproveTemplateComponent', () => {
  let component: DialogApproveTemplateComponent;
  let fixture: ComponentFixture<DialogApproveTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogApproveTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogApproveTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
