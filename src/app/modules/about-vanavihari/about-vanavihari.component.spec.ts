import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutVanavihariComponent } from './about-vanavihari.component';

describe('AboutVanavihariComponent', () => {
  let component: AboutVanavihariComponent;
  let fixture: ComponentFixture<AboutVanavihariComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutVanavihariComponent]
    });
    fixture = TestBed.createComponent(AboutVanavihariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
