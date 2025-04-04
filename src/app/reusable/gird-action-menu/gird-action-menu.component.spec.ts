import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GirdActionMenuComponent } from './gird-action-menu.component';

describe('GirdActionMenuComponent', () => {
  let component: GirdActionMenuComponent;
  let fixture: ComponentFixture<GirdActionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [GirdActionMenuComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(GirdActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
