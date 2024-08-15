import { Component, OnInit } from '@angular/core';
import { Task } from '../../../interfaces/task.interface';
import { TaskService } from '../../services/tasks.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.css'
})
export class TasksPageComponent implements OnInit{

  public displayedColumns: string[] = ['position', 'title', 'description', 'dueDate', 'actions'];
  public tasks: Task[] = [];
  public completedTasks: Task[] = [];
  private recentlyDeletedTask: Task | null = null;

  constructor( private taskService: TaskService, private snackBar: MatSnackBar){}

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
    this.taskService.updateToCompleteTask(task)
      .subscribe({
        next: (response) => {
          const updatedTask = response.object;

          // Elimina la tarea antigua de la lista de tareas pendientes
          if (updatedTask !== null) {
            this.tasks = this.tasks.filter(t => t.id !== updatedTask.id);
            // Añade la tarea actualizada a la lista de tareas completadas
            this.completedTasks = [...this.completedTasks, updatedTask];
          }
        },
        error: (err)  => {
          console.error('Error completing task', err);
          this.snackBar.open('Error completing task. Please try again later.', 'Close', {
            duration: 5000,
          });
        },
      })
  }

  unCompleteTask(task: Task) {
    this.taskService.updateToUncompleteTask(task)
      .subscribe({
        next: (response) => {
          const updatedTask = response.object;

          // Elimina la tarea antigua de la lista de tareas pendientes
          if (updatedTask !== null) {
            this.completedTasks = this.completedTasks.filter(t => t.id !== updatedTask.id);
            // Añade la tarea actualizada a la lista de tareas completadas
            this.tasks = [...this.tasks, updatedTask];
          }
        },
        error: (err)  => {
          console.error('Error completing task', err);
          this.snackBar.open('Error completing task. Please try again later.', 'Close', {
            duration: 5000,
          });
        },
      });
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task)
      .subscribe({
        next: (response) => {
          const deletedTask = response.object;

          // Elimina la tarea antigua de la lista de tareas pendientes
          if (deletedTask !== null) {
            // Guardar la tarea eliminada
            this.recentlyDeletedTask = deletedTask;

            if (!deletedTask.isCompleted) {
              this.tasks = this.tasks.filter(t => t.id !== deletedTask.id);
            } else {
              this.completedTasks = this.completedTasks.filter(t => t.id !== deletedTask.id);
            }

            // this.tasks = [...this.tasks, updatedTask];
            this.snackBar.open('Task deleted', 'Undo', {
              duration: 5000, // Duración en milisegundos
            }).onAction().subscribe(() => {
              this.undoDelete();
            });
          }
        },
        error: (err)  => {
          console.error('Error deleting task', err);
          this.snackBar.open('Error deleting task. Please try again later.', 'Close', {
            duration: 5000,
          });
        },
      });
  }

  createNewTask( task: Task ): boolean {
    this.taskService.createTask(task)
      .subscribe({
        next: (response) => {
          const createdTask = response.object;

          // Elimina la tarea antigua de la lista de tareas pendientes
          if (createdTask !== null) {

            if (!createdTask.isCompleted) {
              this.tasks = [...this.tasks, createdTask];
            } else {
              this.completedTasks = [...this.completedTasks, createdTask];
            }
          }

          return true;
        },
        error: (err)  => {
          console.error('Error creating task', err);
          this.snackBar.open('Error creating task. Please try again later.', 'Close', {
            duration: 5000,
          });
          return false;
        },
      });
      return false;
  }

  undoDelete() {
    if (this.recentlyDeletedTask) {
      // Volver a agregar la tarea eliminada a la lista adecuada
      if( this.createNewTask(this.recentlyDeletedTask) ){
        if (this.recentlyDeletedTask.isCompleted) {
          this.completedTasks = [...this.completedTasks, this.recentlyDeletedTask];
        } else {
          this.tasks = [...this.tasks, this.recentlyDeletedTask];
        }
      }
    }
    else{
      this.snackBar.open('The deleted task could not be recovered', 'Close', {
        duration: 5000,
      });
    }
  }
}
