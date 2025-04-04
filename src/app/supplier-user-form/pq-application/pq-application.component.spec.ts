import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PqApplicationComponent } from './pq-application.component';

describe('PqApplicationComponent', () => {
  let component: PqApplicationComponent;
  let fixture: ComponentFixture<PqApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PqApplicationComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(PqApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
