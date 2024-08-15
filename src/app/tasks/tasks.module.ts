import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TasksRoutingModule } from './tasks-routing.module';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { TasksPageComponent } from './pages/tasks-page/tasks-page.component';
import { MaterialModule } from '../tasks/material/material.module';
import { CreateTaskDialogComponent } from './pages/create-task-dialog/create-task-dialog.component';
import { UpdateTaskDialogComponent } from './pages/update-task-dialog/update-task-dialog.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';


@NgModule({
  declarations: [
    DashboardLayoutComponent,
    TasksPageComponent,
    CreateTaskDialogComponent,
    UpdateTaskDialogComponent,
    AboutPageComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class TasksModule { }
