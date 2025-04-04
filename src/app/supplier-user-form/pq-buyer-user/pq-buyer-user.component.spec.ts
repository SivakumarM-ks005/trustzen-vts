import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PQBuyerUserComponent } from './pq-buyer-user.component';

describe('PQBuyerUserComponent', () => {
  let component: PQBuyerUserComponent;
  let fixture: ComponentFixture<PQBuyerUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PQBuyerUserComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(PQBuyerUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
