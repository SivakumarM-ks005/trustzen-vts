import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreQualificationProcessComponent } from './pre-qualification-process.component';

describe('PreQualificationProcessComponent', () => {
  let component: PreQualificationProcessComponent;
  let fixture: ComponentFixture<PreQualificationProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreQualificationProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreQualificationProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
