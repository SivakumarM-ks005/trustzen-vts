import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogIncotermsComponent } from './dialog-incoterms.component';

describe('DialogIncotermsComponent', () => {
  let component: DialogIncotermsComponent;
  let fixture: ComponentFixture<DialogIncotermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogIncotermsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogIncotermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
