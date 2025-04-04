import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInitiateApprovalComponent } from './dialog-initiate-approval.component';

describe('DialogInitiateApprovalComponent', () => {
  let component: DialogInitiateApprovalComponent;
  let fixture: ComponentFixture<DialogInitiateApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DialogInitiateApprovalComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DialogInitiateApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
