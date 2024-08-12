import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../s../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit{

  public loginForm = new FormGroup({
    one: new FormControl
  });

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required]);

  public loginError = signal('');
  public errorEmailMessage = signal('');
  public errorPasswordMessage = signal('');

  constructor( private authService: AuthService, private router: Router ) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessage());

    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updatePasswordErrorMessage());
  }

  ngOnInit(): void {
    this.email.setValue(this.authService.emailCache || '');
  }

  updateEmailErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorEmailMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorEmailMessage.set('Not a valid email');
    } else {
      this.errorEmailMessage.set('');
    }
  }

  updatePasswordErrorMessage() {
    if (this.password.hasError('required')) {
      this.errorPasswordMessage.set('You must enter a password');
    } else {
      this.errorPasswordMessage.set('');
    }
  }

  onLogin( event: Event ) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    if( this.email.valid && this.password.valid ){
      this.authService.login( this.email.value!, this.password.value! )
        .subscribe({
          next: (response) => {
            // console.log('Login successful', response);
            // alert('Login successful' + JSON.stringify(response));
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            //console.error('Login failed', error);
            this.password.reset();
            this.showLoginError(error.error.message)
          }
        }
      );
    }
  }

  private showLoginError( error: string ) {

    this.loginError.set( error || 'An error occurred during login');

    setTimeout( () => {
      this.loginError.set('');
    }, 10000);//10s
  }
}


