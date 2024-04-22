import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardsNewsPublicationsComponent } from './awards-news-publications.component';

describe('AwardsNewsPublicationsComponent', () => {
  let component: AwardsNewsPublicationsComponent;
  let fixture: ComponentFixture<AwardsNewsPublicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AwardsNewsPublicationsComponent]
    });
    fixture = TestBed.createComponent(AwardsNewsPublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
