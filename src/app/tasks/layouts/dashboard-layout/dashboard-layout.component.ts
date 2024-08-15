import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskDialogComponent } from '../../pages/create-task-dialog/create-task-dialog.component';
import { TaskService } from '../../services/tasks.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'tasks-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent implements OnInit {


  // public sidebarItems = [
  //   {label: 'Dashboard', icon: 'dashboard', url: './dashboard'},
  //   {label: 'Create task', icon: 'add_circle', url: ''},
  //   {label: 'About', icon: 'info', url: './search'}
  // ];

  public currentUser?: User;


  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog, private tasksService: TaskService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.authService.getUser()
      .subscribe({
        next: (response) => {
          const userResponse = response.object;
          if (userResponse) {
            this.currentUser = userResponse;
          }
          else {
            this.handleUserNotFound();
          }
        },
        error: (err) => {
          console.error('Error fetching user:', err);
          this.handleUserNotFound();
        },
      });
  }

  private handleUserNotFound() {
    // Muestra el Snackbar
    this.snackBar.open('Failed to get user. Redirecting...', 'Close', {
      duration: 5000,
    });

    // Redirige al usuario después de 5 segundos
    setTimeout(() => {
      this.router.navigate(['auth']);
    }, 5000); // 5 segundos
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['auth']);
  }

  openCreateTaskDialog(): void {
    const createTaskDialog = this.dialog.open(CreateTaskDialogComponent, {
      width: '400px',
      data: {/*Aqui se puede enviar datos al dialogo */ }
    });

    createTaskDialog.afterClosed().subscribe(result => {
      if (result) {
        // Llama al servicio para crear la tarea
        this.tasksService.createTask(result).subscribe({
          next: (response) => {
            console.log('Task created successfully:', response);
            this.snackBar.open('Task created successfully', 'Close', {
              duration: 5000,
            });

            // Actualizar la lista de tareas
            this.tasksService.updateLocalTasksList();
          },
          error: (err) => {
            console.error('Error creating task:', err);
            this.snackBar.open('Failed to create task. Please try again later.', 'Close', {
              duration: 5000,
            });
          },
        });
      }
    });
  }

}
