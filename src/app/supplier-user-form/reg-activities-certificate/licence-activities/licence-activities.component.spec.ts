import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceActivitiesComponent } from './licence-activities.component';

describe('LicenceActivitiesComponent', () => {
  let component: LicenceActivitiesComponent;
  let fixture: ComponentFixture<LicenceActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LicenceActivitiesComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(LicenceActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
