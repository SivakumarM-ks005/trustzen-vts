import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrActionMenuComponent } from './pr-action-menu.component';

describe('PrActionMenuComponent', () => {
  let component: PrActionMenuComponent;
  let fixture: ComponentFixture<PrActionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrActionMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
