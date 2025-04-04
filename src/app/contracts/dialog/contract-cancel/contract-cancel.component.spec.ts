import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractCancelComponent } from './contract-cancel.component';

describe('ContractCancelComponent', () => {
  let component: ContractCancelComponent;
  let fixture: ComponentFixture<ContractCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ContractCancelComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ContractCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
