import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-tribal-community',
  templateUrl: './tribal-community.component.html',
  styleUrls: ['./tribal-community.component.scss'],
})
export class TribalCommunityComponent {
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }
}
