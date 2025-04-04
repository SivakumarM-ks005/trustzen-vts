import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PqAssesmentListComponent } from './pq-assesment-list.component';

describe('PqAssesmentListComponent', () => {
  let component: PqAssesmentListComponent;
  let fixture: ComponentFixture<PqAssesmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PqAssesmentListComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(PqAssesmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
