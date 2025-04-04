import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyInformationComponent } from './party-information.component';

describe('PartyInformationComponent', () => {
  let component: PartyInformationComponent;
  let fixture: ComponentFixture<PartyInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PartyInformationComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(PartyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
