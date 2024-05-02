import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {

  constructor(private renderer:Renderer2){

  }

  ngOnInit(){
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);

  }

}
