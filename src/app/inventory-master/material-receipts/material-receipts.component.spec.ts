import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialReceiptsComponent } from './material-receipts.component';

describe('MaterialReceiptsComponent', () => {
  let component: MaterialReceiptsComponent;
  let fixture: ComponentFixture<MaterialReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialReceiptsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
