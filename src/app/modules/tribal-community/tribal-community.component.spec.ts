import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TribalCommunityComponent } from './tribal-community.component';

describe('TribalCommunityComponent', () => {
  let component: TribalCommunityComponent;
  let fixture: ComponentFixture<TribalCommunityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TribalCommunityComponent]
    });
    fixture = TestBed.createComponent(TribalCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
