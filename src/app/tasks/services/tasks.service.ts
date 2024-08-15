import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { TaskResponse, TasksResponse } from '../interfaces/tasks-response.interface';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../interfaces/task.interface';

@Injectable({ providedIn: 'root' })
export class TaskService {



  private basicUrl = 'http://localhost:8081/api/v1';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserTasks(): Observable<TasksResponse> {
    const userId = this.authService.getUserId();
    return this.http.get<TasksResponse>(`${this.basicUrl}/task/user/${userId}`);
  }

  updateToCompleteTask(task: Task): Observable<TaskResponse> {
    const updatedTask = { ...task, isCompleted: true };
    // console.log('Updating task:', updatedTask);
    return this.http.put<TaskResponse>(`${this.basicUrl}/task/${task.id}`, updatedTask);
  }
  updateToUncompleteTask(task: Task) {
    const updatedTask = { ...task, isCompleted: false };
    return this.http.put<TaskResponse>(`${this.basicUrl}/task/${task.id}`, updatedTask);
  }

  deleteTask(task: Task): Observable<TaskResponse> {
    return this.http.delete<TaskResponse>(`${this.basicUrl}/task/${task.id}`);
  }

  createTask(task: Task): Observable<TaskResponse> {
    // Verificar si el task ya tiene un user asociado
    if (task.user) {
      // Si tiene usuario, se procede directamente a la creación de la tarea
      const newTask = { ...task };
      return this.http.post<TaskResponse>(`${this.basicUrl}/task`, newTask);
    } else {
      return this.authService.getUser()
        .pipe(
          switchMap(userResponse => {
            const newTask = { ...task, user: userResponse.object };
            return this.http.post<TaskResponse>(`${this.basicUrl}/task`, newTask);
          })
        );
    }
  }

   // Método para actualizar la lista de tareas en el BehaviorSubject
   updateLocalTasksList() {
    this.getUserTasks().subscribe(response => {
      if (response.object) {
        this.tasksSubject.next(response.object);
      }
    });
  }
}
