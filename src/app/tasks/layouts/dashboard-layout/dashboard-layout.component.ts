import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'tasks-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent implements OnInit{

  // public sidebarItems = [
  //   {label: 'Dashboard', icon: 'dashboard', url: './dashboard'},
  //   {label: 'Create task', icon: 'add_circle', url: ''},
  //   {label: 'About', icon: 'info', url: './search'}
  // ];

  public userName?: string;

  constructor( private authService: AuthService, private router: Router  ){}

  ngOnInit(): void {
    if( this.authService.getUser()){
      this.userName = this.authService.getUser()?.username;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['auth'])
  }

}
