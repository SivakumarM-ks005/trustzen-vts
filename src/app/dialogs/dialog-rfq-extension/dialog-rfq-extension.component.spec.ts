import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRfqExtensionComponent } from './dialog-rfq-extension.component';

describe('DialogRfqExtensionComponent', () => {
  let component: DialogRfqExtensionComponent;
  let fixture: ComponentFixture<DialogRfqExtensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogRfqExtensionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogRfqExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
