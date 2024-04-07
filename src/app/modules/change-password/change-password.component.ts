import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../user.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  form: FormGroup;
  isLoading: boolean = false;
  password_hide = true;
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      old_password: ['', Validators.required],
      newpassword: ['', Validators.required],
      repeatpassword: ['', Validators.required],
    });
  }
  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      const params = new HttpParams()
        .set('oldpassword', this.form.value.old_password)
        .set('newpassword', this.form.value.newpassword)
        .set('repeatpassword', this.form.value.repeatpassword);

      // this.http
      //   .get<any>(
      //     'https://vanavihari-ng.netlify.app/zoho-connect?api_type=login',
      //     { params }
      //   )
      //   .subscribe({
      //     next: (response) => {
      //       console.log('response--', response);
      //       if (response.code == 3000 && response.result.status == 'success') {
      //         this.router.navigate(['/home']);
      //         this.isLoading = false;
      //         this.showSnackBarAlert(
      //           'Login Success. Token: ' + response.result.token,
      //           false
      //         );
      //         this.authService.setAccessToken(response.result.token);
      //         this.authService.setAccountUsername(
      //           this.form.value.email_address
      //         );
      //         this.authService.setAccountUserFullname(
      //           response.result.userfullname
      //         );
      //       } else if (response.code == 3000) {
      //         this.isLoading = false;
      //         this.showSnackBarAlert(response.result.msg);
      //       } else {
      //         this.isLoading = false;
      //         this.showSnackBarAlert('Please Check this Credential!');
      //       }
      //     },
      //     error: (err) => {
      //       this.isLoading = false;
      //       console.error('Error:', err);
      //     },
      //   });
    }
  }

  changePasswod(){
    
  }

  showSnackBarAlert(msg = '', redirect = true) {
    var snackBar = this.snackBar.open(msg, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
    });
    if (redirect) {
      snackBar.afterDismissed().subscribe(() => {
        this.router.navigate(['/sign-in']);
      });
    }
  }
  
  togglePasswordVisibility(): void {
    this.password_hide = !this.password_hide;
  }
}
