import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousAlrtComponent } from './previous-alrt.component';

describe('PreviousAlrtComponent', () => {
  let component: PreviousAlrtComponent;
  let fixture: ComponentFixture<PreviousAlrtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviousAlrtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviousAlrtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
