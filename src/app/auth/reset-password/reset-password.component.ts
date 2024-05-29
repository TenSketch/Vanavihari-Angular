import { environment } from '@/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  form: FormGroup;
  showLoader=false;
  disableSubmit = false
  api_url:any 
  message=''

  constructor(private formBuilder: FormBuilder, private router:Router,    private http: HttpClient    ) {
    this.api_url = environment.API_URL
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email_address: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(){
    this.showLoader = true
      // console.log(this.form.value.email_address)
      const params = new HttpParams().set('email_id', this.form.value.email_address ?? '');
    this.http
      .get<any>(this.api_url + '?api_type=reset_password', { params })
      .subscribe({
        next: (response) => {
          this.showLoader = false
           this.message=(response.result.msg)
        },
        error: (err) => {
          this.showLoader = false;
        },
      });
  }

  goToSignin(){
    this.router.navigate(['/sign-in']);

  }

  goToSignup(){
    this.router.navigate(['/sign-up']);

  }

}
