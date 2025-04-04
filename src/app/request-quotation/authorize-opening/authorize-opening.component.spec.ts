import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeOpeningComponent } from './authorize-opening.component';

describe('AuthorizeOpeningComponent', () => {
  let component: AuthorizeOpeningComponent;
  let fixture: ComponentFixture<AuthorizeOpeningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizeOpeningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeOpeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
