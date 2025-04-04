import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CqaComponent } from './cqa.component';

describe('CqaComponent', () => {
  let component: CqaComponent;
  let fixture: ComponentFixture<CqaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CqaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CqaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
