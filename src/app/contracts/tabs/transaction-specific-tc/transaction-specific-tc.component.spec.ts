import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSpecificTCComponent } from './transaction-specific-tc.component';

describe('TransactionSpecificTCComponent', () => {
  let component: TransactionSpecificTCComponent;
  let fixture: ComponentFixture<TransactionSpecificTCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TransactionSpecificTCComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TransactionSpecificTCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
