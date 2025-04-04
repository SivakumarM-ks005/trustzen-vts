import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalGuidelinesComponent } from './renewal-guidelines.component';

describe('RenewalGuidelinesComponent', () => {
  let component: RenewalGuidelinesComponent;
  let fixture: ComponentFixture<RenewalGuidelinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RenewalGuidelinesComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(RenewalGuidelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
