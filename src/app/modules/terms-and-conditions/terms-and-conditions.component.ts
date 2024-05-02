import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent {

  constructor(private renderer:Renderer2){}

  ngOnInit(){
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);

  }
}
