import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFreezeTemplateComponent } from './dialog-freeze-template.component';

describe('DialogFreezeTemplateComponent', () => {
  let component: DialogFreezeTemplateComponent;
  let fixture: ComponentFixture<DialogFreezeTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DialogFreezeTemplateComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DialogFreezeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
