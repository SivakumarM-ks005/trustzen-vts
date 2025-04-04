import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBafoLafoComponent } from './dialog-bafo-lafo.component';

describe('DialogBafoLafoComponent', () => {
  let component: DialogBafoLafoComponent;
  let fixture: ComponentFixture<DialogBafoLafoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogBafoLafoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogBafoLafoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
