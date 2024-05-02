import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-payment-policies',
  templateUrl: './payment-policies.component.html',
  styleUrls: ['./payment-policies.component.scss']
})
export class PaymentPoliciesComponent {

  constructor(private renderer:Renderer2){
      
  }

  ngOnInit(){
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }
}
