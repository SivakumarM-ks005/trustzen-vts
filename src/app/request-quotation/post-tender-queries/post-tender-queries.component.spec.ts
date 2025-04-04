import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTenderQueriesComponent } from './post-tender-queries.component';

describe('PostTenderQueriesComponent', () => {
  let component: PostTenderQueriesComponent;
  let fixture: ComponentFixture<PostTenderQueriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostTenderQueriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostTenderQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
