import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceCertificatesComponent } from './licence-certificates.component';

describe('LicenceCertificatesComponent', () => {
  let component: LicenceCertificatesComponent;
  let fixture: ComponentFixture<LicenceCertificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LicenceCertificatesComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(LicenceCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
