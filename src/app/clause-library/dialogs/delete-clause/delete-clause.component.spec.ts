import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteClauseComponent } from './delete-clause.component';

describe('DeleteClauseComponent', () => {
  let component: DeleteClauseComponent;
  let fixture: ComponentFixture<DeleteClauseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DeleteClauseComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DeleteClauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
