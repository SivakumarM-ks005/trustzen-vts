import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogQueriesClarificationsComponent } from './dialog-queries-clarifications.component';

describe('DialogQueriesClarificationsComponent', () => {
  let component: DialogQueriesClarificationsComponent;
  let fixture: ComponentFixture<DialogQueriesClarificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogQueriesClarificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogQueriesClarificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
