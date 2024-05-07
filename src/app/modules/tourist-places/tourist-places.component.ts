import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-tourist-places',
  templateUrl: './tourist-places.component.html',
  styleUrls: ['./tourist-places.component.scss'],
})
export class TouristPlacesComponent {
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }
}
