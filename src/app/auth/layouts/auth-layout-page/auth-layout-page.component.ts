import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'auth-layout-page',
  templateUrl: './auth-layout-page.component.html',
  styleUrls: ['./auth-layout-page.component.css']
})
export class AuthLayoutPageComponent implements OnInit {

  public activeButton: 'login' | 'register' = 'login';
  public subtitle: string = 'Access your account by entering your credentials below.';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.activeView$.subscribe(view => {
      this.activeButton = view;
      this.subtitle = view === 'register'
        ? 'Create a new account to get started with our services.'
        : 'Access your account by entering your credentials below.';
    });

    this.route.url.subscribe(urlSegment => {
      if (this.router.url.includes('register')) {
        this.authService.setActiveView('register');
      } else if (this.router.url.includes('login')) {
        this.authService.setActiveView('login');
      }
    });

    this.authService.message$.subscribe(message => {
      if (message) {
        this.snackBar.open(message, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    });
  }

  goRegister() {
    this.router.navigate(['auth/register']);
    //this.setRegisterState();
  }
  goLogin() {
    this.router.navigate(['auth/login']);
    //this.setLoginState();
  }
}
