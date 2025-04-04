import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeactivateTemplateComponent } from './dialog-deactivate-template.component';

describe('DialogDeactivateTemplateComponent', () => {
  let component: DialogDeactivateTemplateComponent;
  let fixture: ComponentFixture<DialogDeactivateTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DialogDeactivateTemplateComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DialogDeactivateTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
