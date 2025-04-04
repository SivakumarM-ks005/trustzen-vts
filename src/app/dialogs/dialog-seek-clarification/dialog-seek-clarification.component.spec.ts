import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSeekClarificationComponent } from './dialog-seek-clarification.component';

describe('DialogSeekClarificationComponent', () => {
  let component: DialogSeekClarificationComponent;
  let fixture: ComponentFixture<DialogSeekClarificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DialogSeekClarificationComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DialogSeekClarificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
