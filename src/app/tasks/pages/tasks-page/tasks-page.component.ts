import { Component, OnInit } from '@angular/core';
import { Task } from '../../../interfaces/task.interface';
import { TaskService } from '../../services/tasks.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTaskDialogComponent } from '../update-task-dialog/update-task-dialog.component';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.css']
})
export class TasksPageComponent implements OnInit {

  public displayedColumns: string[] = ['position', 'title', 'description', 'dueDate', 'actions'];
  public tasks: Task[] = [];
  public completedTasks: Task[] = [];
  private recentlyDeletedTask: Task | null = null;

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private updateRefDialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Suscribirse a las tareas del servicio
    this.taskService.tasks$.subscribe(tasks => {

      this.tasks = tasks.filter(task => !task.isCompleted);
      this.completedTasks = tasks.filter(task => task.isCompleted);
    });

    // Cargar tareas iniciales
    this.taskService.updateLocalTasksList();
  }

  completeTask(task: Task) {
    this.taskService.updateToCompleteTask(task).subscribe({
      next: () => {
        this.snackBar.open('Task completed successfully', 'Close', { duration: 5000 });
      },
      error: (err) => {
        console.error('Error completing task', err);
        this.snackBar.open('Error completing task. Please try again later.', 'Close', { duration: 5000 });
      }
    });
  }

  unCompleteTask(task: Task) {
    this.taskService.updateToUncompleteTask(task).subscribe({
      next: () => {
        this.snackBar.open('Task marked as incomplete', 'Close', { duration: 5000 });
      },
      error: (err) => {
        console.error('Error marking task as incomplete', err);
        this.snackBar.open('Error marking task as incomplete. Please try again later.', 'Close', { duration: 5000 });
      }
    });
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task).subscribe({
      next: () => {
        this.recentlyDeletedTask = task;
        this.snackBar.open('Task deleted', 'Undo', {
          duration: 5000,
        }).onAction().subscribe(() => {
          this.undoDelete();
        });
      },
      error: (err) => {
        console.error('Error deleting task', err);
        this.snackBar.open('Error deleting task. Please try again later.', 'Close', { duration: 5000 });
      }
    });
  }

  createNewTask(task: Task) {
    this.taskService.createTask(task).subscribe({
      next: () => {
        this.snackBar.open('Task created successfully', 'Close', { duration: 5000 });
      },
      error: (err) => {
        console.error('Error creating task', err);
        this.snackBar.open('Error creating task. Please try again later.', 'Close', { duration: 5000 });
      }
    });
  }

  openEditorTaskDialog(task: Task) {
    console.log('Tarea antes de abrir el diálogo:', task);
    const updateTaskDialog = this.updateRefDialog.open(UpdateTaskDialogComponent, {
      width: '400px',
      data: task
    });

    updateTaskDialog.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.updateTask(result).subscribe({
          next: () => {
            this.snackBar.open('Task updated successfully', 'Close', { duration: 5000 });
          },
          error: (err) => {
            console.error('Error updating task:', err);
            this.snackBar.open('Failed to update task. Please try again later.', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  undoDelete() {
    if (this.recentlyDeletedTask) {
      this.createNewTask(this.recentlyDeletedTask);
    } else {
      this.snackBar.open('The deleted task could not be recovered', 'Close', { duration: 5000 });
    }
  }
}
