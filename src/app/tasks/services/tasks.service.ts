import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { TaskResponse, TasksResponse } from '../interfaces/tasks-response.interface';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../interfaces/task.interface';

@Injectable({ providedIn: 'root' })
export class TaskService {

  private basicUrl = 'https://intuitive-friendship-production.up.railway.app/api/v1';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  private currentPageSubject = new BehaviorSubject<'dashboard' | 'about'>('dashboard');
  public currentPage$ = this.currentPageSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserTasks(): Observable<TasksResponse> {
    const userId = this.authService.getUserId();
    return this.http.get<TasksResponse>(`${this.basicUrl}/task/user/${userId}`);
  }

  updateToCompleteTask(task: Task): Observable<TaskResponse> {
    const updatedTask = { ...task, isCompleted: true };
    return this.http.put<TaskResponse>(`${this.basicUrl}/task/${task.id}`, updatedTask)
      .pipe(
        tap(() => this.updateLocalTasksList()) // Actualizar la lista después de completar la tarea
      );
  }

  updateToUncompleteTask(task: Task): Observable<TaskResponse> {
    const updatedTask = { ...task, isCompleted: false };
    return this.http.put<TaskResponse>(`${this.basicUrl}/task/${task.id}`, updatedTask)
      .pipe(
        tap(() => this.updateLocalTasksList()) // Actualizar la lista después de descompletar la tarea
      );
  }

  deleteTask(task: Task): Observable<TaskResponse> {
    return this.http.delete<TaskResponse>(`${this.basicUrl}/task/${task.id}`)
      .pipe(
        tap(() => this.updateLocalTasksList()) // Actualizar la lista después de eliminar la tarea
      );
  }

  createTask(task: Task): Observable<TaskResponse> {
    if (task.user) {
      return this.http.post<TaskResponse>(`${this.basicUrl}/task`, task)
        .pipe(
          tap(() => this.updateLocalTasksList()) // Actualizar la lista después de crear la tarea
        );
    } else {
      return this.authService.getUser()
        .pipe(
          switchMap(userResponse => {
            const newTask = { ...task, user: userResponse.object };
            return this.http.post<TaskResponse>(`${this.basicUrl}/task`, newTask);
          }),
          tap(() => this.updateLocalTasksList()) // Actualizar la lista después de crear la tarea
        );
    }
  }

  updateTask(task: Task): Observable<TaskResponse> {
    if (task.user) {
      return this.http.put<TaskResponse>(`${this.basicUrl}/task/${task.id}`, task)
        .pipe(
          tap(() => this.updateLocalTasksList()) // Actualizar la lista después de actualizar la tarea
        );
    } else {
      return this.authService.getUser()
        .pipe(
          switchMap(userResponse => {
            const updatedTask = { ...task, user: userResponse.object };
            return this.http.put<TaskResponse>(`${this.basicUrl}/task/${task.id}`, updatedTask);
          }),
          tap(() => this.updateLocalTasksList()) // Actualizar la lista después de actualizar la tarea
        );
    }
  }

  updateCurrentPage( page: 'dashboard' | 'about' ): void{
    this.currentPageSubject.next(page);
  }

  // Método para actualizar la lista de tareas en el BehaviorSubject
  updateLocalTasksList() {
    this.getUserTasks().subscribe(response => {
      const tasks = response.object || [];
      // console.log('Normal', tasks);

      // Hacer una copia de la lista antes de invertirla
      const reversedTasks = [...tasks].reverse();

      // console.log('Reverse', reversedTasks);

      // Actualizar el BehaviorSubject con la lista invertida
      this.tasksSubject.next(reversedTasks);
    });
  }

}
