import { environment } from '@/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  form: FormGroup;
  repeat_password: any;
  password_hide = true;
  repeate_password_hide = true;
  api_url: any;
  showLoader = false;
  client_key: any;
  email_id: any;
  userId: any;
  token: any;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.api_url = environment.API_URL;
    this.client_key = '6Lc1LuopAAAAANFzqMeEI67Y-o8Zt-lhlsMn1CWQ';
    this.route.queryParams.subscribe((queryParams) => {
      this.email_id = queryParams['email'];
      console.log('Email:', this.email_id);
    });

    this.route.params.subscribe((params) => {
      this.userId = params['userid'];
      this.token = params['token'];
      console.log(this.userId, this.token);
    });
  }

  ngOnInit() {
    this.form = this.formBuilder.group(
      {
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/
            ),
          ]),
        ],
        repeat_password: ['', Validators.compose([Validators.required])],
        recaptcha: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  togglePasswordVisibility(): void {
    this.password_hide = !this.password_hide;
  }

  toggleRepeatPasswordVisibility(): void {
    this.repeate_password_hide = !this.repeate_password_hide;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const repeatPassword = form.get('repeat_password')?.value;
    if (password !== repeatPassword) {
      form.get('repeat_password')?.setErrors({ passwordsNotMatch: true });
    } else {
      form.get('repeat_password')?.setErrors(null);
    }

    return null;
  }

  onSubmit() {
    this.showLoader = true;
    let params = new HttpParams()
      .set('userid', this.userId)
      .set('token', this.token)
      .set('password', this.form.value.password);

    this.http
      .get<any>(this.api_url + '?api_type=update_password', { params })
      .subscribe({
        next: (response) => {
          this.showSnackBarAlert(response.result.status);
          this.showLoader = false;
          if (response.result.status == 'success') {
            this.router.navigate(['/sign-in']);
          }
        },
        error: (err) => {
          this.showSnackBarAlert(err);
          this.showLoader = false;
        },
      });
  }

  showSnackBarAlert(msg = '') {
    var snackBar = this.snackBar.open(msg, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
    });
  }
}
