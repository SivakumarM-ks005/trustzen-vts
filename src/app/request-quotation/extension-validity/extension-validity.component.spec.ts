import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionValidityComponent } from './extension-validity.component';

describe('ExtensionValidityComponent', () => {
  let component: ExtensionValidityComponent;
  let fixture: ComponentFixture<ExtensionValidityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtensionValidityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtensionValidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
