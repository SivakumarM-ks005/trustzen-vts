import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegActivitiesCertificateComponent } from './reg-activities-certificate.component';

describe('RegActivitiesCertificateComponent', () => {
  let component: RegActivitiesCertificateComponent;
  let fixture: ComponentFixture<RegActivitiesCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RegActivitiesCertificateComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(RegActivitiesCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
