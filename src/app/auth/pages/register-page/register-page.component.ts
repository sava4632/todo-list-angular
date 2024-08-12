import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  public registerForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      // Validators.pattern('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])')
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern('^[a-zA-Z0-9]+$')
    ])
  });

  emailControl = this.registerForm.get('email') as FormControl;
  passwordControl = this.registerForm.get('password') as FormControl;
  usernameControl = this.registerForm.get('username') as FormControl;


  public registerError = signal('');
  public errorEmailMessage = signal('');
  public errorPasswordMessage = signal('');
  public errorUsernameMessage = signal('');

  constructor(private authService: AuthService, private router: Router) {

    this.authService.setActiveView('register');

    if (this.emailControl && this.passwordControl && this.usernameControl) {
      merge(this.emailControl.statusChanges, this.emailControl.valueChanges)
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.updateEmailErrorMessage());

      merge(this.passwordControl.statusChanges, this.passwordControl.valueChanges)
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.updatePasswordErrorMessage());

      merge(this.usernameControl.statusChanges, this.usernameControl.valueChanges)
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.updateUsernameErrorMessage());
    }
  }

  onRegister(event: Event) {
    event.preventDefault();

    if( this.emailControl.valid && this.passwordControl.valid && this.usernameControl.valid ){
      this.authService.register( this.emailControl.value, this.passwordControl.value, this.usernameControl.value )
        .subscribe({
          next: ( response ) => {
            this.authService.setMessage('Registration successful!');
            this.router.navigate(['/auth']); //enviar al usuario al login
          },
          error: (error) => {
            this.showRegisterError('An error occurred during registration')
          },
        })
    }
  }

  updateEmailErrorMessage() {
    const emailControl = this.registerForm.get('email');
    if (emailControl?.hasError('required')) {
      this.errorEmailMessage.set('You must enter a value');
    } else if (emailControl?.hasError('email')) {
      this.errorEmailMessage.set('Not a valid email');
    } else {
      this.errorEmailMessage.set('');
    }
  }

  updatePasswordErrorMessage() {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl?.hasError('required')) {
      this.errorPasswordMessage.set('You must enter a password');
    } else if (passwordControl?.hasError('minlength')) {
      this.errorPasswordMessage.set('Password must be at least 8 characters long');
    } else if (passwordControl?.hasError('pattern')) {
      this.errorPasswordMessage.set('Password must contain a number, a letter, and a special character');
    } else {
      this.errorPasswordMessage.set('');
    }
  }

  updateUsernameErrorMessage() {
    const usernameControl = this.registerForm.get('username');
    if (usernameControl?.hasError('required')) {
      this.errorUsernameMessage.set('You must enter a username');
    } else if (usernameControl?.hasError('minlength')) {
      this.errorUsernameMessage.set('Username must be at least 3 characters long');
    } else if (usernameControl?.hasError('pattern')) {
      this.errorUsernameMessage.set('Username can only contain letters and numbers');
    } else {
      this.errorUsernameMessage.set('');
    }
  }

  private showRegisterError( error: string ) {

    this.registerError.set( error || 'An error occurred during register');

    setTimeout( () => {
      this.registerError.set('');
    }, 10000);//10s
  }
}
