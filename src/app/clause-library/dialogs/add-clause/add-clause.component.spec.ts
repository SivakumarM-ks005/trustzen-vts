import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClauseComponent } from './add-clause.component';

describe('AddClauseComponent', () => {
  let component: AddClauseComponent;
  let fixture: ComponentFixture<AddClauseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AddClauseComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(AddClauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
