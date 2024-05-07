import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-success-message',
  templateUrl: './show-success-message.component.html',
  styleUrls: ['./show-success-message.component.scss']
})
export class ShowSuccessMessageComponent {
  email_id: string;

  constructor(private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email_id = params['id'];
    });
  }
}
