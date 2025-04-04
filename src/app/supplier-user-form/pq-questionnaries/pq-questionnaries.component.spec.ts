import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PqQuestionnariesComponent } from './pq-questionnaries.component';

describe('PqQuestionnariesComponent', () => {
  let component: PqQuestionnariesComponent;
  let fixture: ComponentFixture<PqQuestionnariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PqQuestionnariesComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(PqQuestionnariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
