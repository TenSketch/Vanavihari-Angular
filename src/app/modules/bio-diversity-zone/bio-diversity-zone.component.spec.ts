import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BioDiversityZoneComponent } from './bio-diversity-zone.component';

describe('BioDiversityZoneComponent', () => {
  let component: BioDiversityZoneComponent;
  let fixture: ComponentFixture<BioDiversityZoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BioDiversityZoneComponent]
    });
    fixture = TestBed.createComponent(BioDiversityZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
