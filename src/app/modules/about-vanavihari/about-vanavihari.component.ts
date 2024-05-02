import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-about-vanavihari',
  templateUrl: './about-vanavihari.component.html',
  styleUrls: ['./about-vanavihari.component.scss']
})
export class AboutVanavihariComponent {

  constructor(private renderer: Renderer2){

  }
  
  ngOnInit(){
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);

  }
}
