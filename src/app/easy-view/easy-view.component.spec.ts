import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyViewComponent } from './easy-view.component';

describe('EasyViewComponent', () => {
  let component: EasyViewComponent;
  let fixture: ComponentFixture<EasyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasyViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
