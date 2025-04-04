import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMenusComponent } from './dashboard-menus.component';

describe('DashboardMenusComponent', () => {
  let component: DashboardMenusComponent;
  let fixture: ComponentFixture<DashboardMenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DashboardMenusComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
