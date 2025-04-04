import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractRepositoryComponent } from './contract-repository.component';

describe('ContractRepositoryComponent', () => {
  let component: ContractRepositoryComponent;
  let fixture: ComponentFixture<ContractRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ContractRepositoryComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ContractRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
