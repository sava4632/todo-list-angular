import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

@Component({
  selector: 'auth-layout-page',
  templateUrl: './auth-layout-page.component.html',
  styleUrl: './auth-layout-page.component.css'
})
export class AuthLayoutPageComponent implements OnInit{

  public activeButton: 'login' | 'register' = 'login';
  public subtitle: string = 'Access your account by entering your credentials below.';

  constructor( private router: Router, private route: ActivatedRoute ){}

  ngOnInit(): void {
    this.route.url.subscribe( urlSegment => {
      if ( this.router.url.includes('register')) {
        this.setRegisterState();
      }
      else {
        this.setLoginState();
      }
    })
  }


  goRegister() {
    this.router.navigate(['auth/register']);
    this.setRegisterState();
  }
  goLogin() {
    this.router.navigate(['auth/login']);
    this.setLoginState();
  }

  private setRegisterState() {
    this.activeButton = 'register';
    this.subtitle = 'Create a new account to get started with our services.';
  }

  private setLoginState() {
    this.activeButton = 'login';
    this.subtitle = 'Access your account by entering your credentials below.';
  }
}
