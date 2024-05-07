import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-read-payment-transaction-response',
  templateUrl: './read-payment-transaction-response.component.html',
  styleUrls: ['./read-payment-transaction-response.component.scss']
})
export class ReadPaymentTransactionResponseComponent {
  requests: any[] = [];
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
    });
  }
}
