import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    function emailValidator(
      control: FormControl
    ): { [s: string]: boolean } | null {
      if (
        !control.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ) {
        return { invalidEmail: true };
      }
      return null; // Return null when validation succeeds
    }
    this.form = this.formBuilder.group(
      {
        // email_id: ['', Validators.compose([Validators.required, Validators.email])],
        email_id: [
          '',
          Validators.compose([Validators.required, emailValidator]),
        ],
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

  onSubmit() {}
}
