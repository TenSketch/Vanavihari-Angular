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
  constructor(private formBuilder: FormBuilder, private router:Router) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email_address: ['', Validators.required],
    });
  }

  onSubmit(){

  }

  goToSignin(){
    this.router.navigate(['/sign-in']);

  }

  goToSignup(){

  }

}
