import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrActionMenuComponent } from './mr-action-menu.component';

describe('MrActionMenuComponent', () => {
  let component: MrActionMenuComponent;
  let fixture: ComponentFixture<MrActionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MrActionMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
