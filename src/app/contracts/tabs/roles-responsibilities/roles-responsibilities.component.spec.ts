import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesResponsibilitiesComponent } from './roles-responsibilities.component';

describe('RolesResponsibilitiesComponent', () => {
  let component: RolesResponsibilitiesComponent;
  let fixture: ComponentFixture<RolesResponsibilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RolesResponsibilitiesComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(RolesResponsibilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
