import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiodiversityZoneComponent } from './biodiversity-zone.component';

describe('BiodiversityZoneComponent', () => {
  let component: BiodiversityZoneComponent;
  let fixture: ComponentFixture<BiodiversityZoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BiodiversityZoneComponent]
    });
    fixture = TestBed.createComponent(BiodiversityZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
