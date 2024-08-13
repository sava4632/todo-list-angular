import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Observable } from 'rxjs';
import { TaskResponse, TasksResponse } from '../interfaces/tasks-response.interface';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../interfaces/task.interface';

@Injectable({providedIn: 'root'})
export class TaskService {



  private basicUrl = 'http://localhost:8081/api/v1';

  constructor( private http: HttpClient, private authService: AuthService ) {}

  getUserTasks(): Observable<TasksResponse>{
    const userId = this.authService.getUserId();
    return this.http.get<TasksResponse>(`${ this.basicUrl }/task/user/${ userId }`);
  }

  updateToCompleteTask( task: Task ): Observable<TaskResponse>{
    const updatedTask = { ...task, isCompleted: true };
    // console.log('Updating task:', updatedTask);
    return this.http.put<TaskResponse>(`${ this.basicUrl }/task/${ task.id }`, updatedTask);
  }
  updateToUncompleteTask(task: Task) {
    const updatedTask = { ...task, isCompleted: false };
    return this.http.put<TaskResponse>(`${ this.basicUrl }/task/${ task.id }`, updatedTask);
  }

  deleteTask( task: Task ): Observable<TaskResponse>{
    return this.http.delete<TaskResponse>(`${ this.basicUrl }/task/${ task.id }`);
  }

  createTask(task: Task): Observable<TaskResponse>{
    return this.http.post<TaskResponse>(`${ this.basicUrl }/task`, task);
  }

}
