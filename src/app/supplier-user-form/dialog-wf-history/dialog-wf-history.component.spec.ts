import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogWfHistoryComponent } from './dialog-wf-history.component';

describe('DialogWfHistoryComponent', () => {
  let component: DialogWfHistoryComponent;
  let fixture: ComponentFixture<DialogWfHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogWfHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogWfHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
