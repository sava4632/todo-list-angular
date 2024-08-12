import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { TasksPageComponent } from './pages/tasks-page/tasks-page.component';
import { MaterialModule } from '../tasks/material/material.module';


@NgModule({
  declarations: [
    DashboardLayoutComponent,
    TasksPageComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    MaterialModule
  ]
})
export class TasksModule { }
