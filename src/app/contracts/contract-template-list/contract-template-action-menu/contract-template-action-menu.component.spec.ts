import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractTemplateActionMenuComponent } from './contract-template-action-menu.component';

describe('ContractTemplateActionMenuComponent', () => {
  let component: ContractTemplateActionMenuComponent;
  let fixture: ComponentFixture<ContractTemplateActionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractTemplateActionMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractTemplateActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
