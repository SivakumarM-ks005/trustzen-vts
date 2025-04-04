import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedPartyDiscComponent } from './related-party-disc.component';

describe('RelatedPartyDiscComponent', () => {
  let component: RelatedPartyDiscComponent;
  let fixture: ComponentFixture<RelatedPartyDiscComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RelatedPartyDiscComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(RelatedPartyDiscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
