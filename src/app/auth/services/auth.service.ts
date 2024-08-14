import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private basicAPIUrl: string = 'http://localhost:8081/api/v1';
  public emailCache?: string;
  private userIdKey: string = 'userId';
  private user: User | null = null;

  private messageSnackSubject = new BehaviorSubject<string>('');
  message$ = this.messageSnackSubject.asObservable();

  private activeViewSubject = new BehaviorSubject<'login' | 'register'>('login');
  activeView$ = this.activeViewSubject.asObservable();

  constructor( private http: HttpClient ) { }

  login( email: string, password: string ): Observable<AuthResponse> {
    this.emailCache = email;
    const user: User = {
      id: 0,
      username: '',
      email: email,
      password: password
    };
    return this.http.post<AuthResponse>(`${this.basicAPIUrl}/user/login`, user)
    .pipe(
      tap((response: AuthResponse) => {
        if (response.object) {
          this.removeUserData();
          this.saveUserData(response.object); // Guarda el email y el ID del usuario en el almacenamiento local
          this.user = response.object;
        }
      })
    );
  }

  register( email: string, password: string, username: string): Observable<AuthResponse>{
    this.emailCache = email;
    const user: User = {
      id: 0,
      username: username,
      email: email,
      password: password
    };
    return this.http.post<AuthResponse>(`${this.basicAPIUrl}/user/register`, user)
    .pipe(
      tap((response: AuthResponse) => {
        if (response.object) {
          this.emailCache = response.object.email;
          this.removeUserData();
          this.saveUserData(response.object);
        }
      })
    );
  }

  private saveUserData(user: User): void {
    // localStorage.setItem(this.userIdKey, user.email);
    if (user.id !== undefined) {
      localStorage.setItem(this.userIdKey, user.id.toString()); // Guarda el ID del usuario
    }
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  getUser(): User | null{
    return this.user;
  }

  private removeUserData(): void {
    localStorage.removeItem(this.userIdKey);
  }

  isAuthenticated(): boolean {
    console.log(this.getUserId())
    return !!this.getUserId(); // Devuelve true si hay un ID de usuario, false en caso contrario
  }

  logout(): void {
    this.removeUserData(); // Elimina el email y el ID del usuario del almacenamiento local
  }

  setMessage(msg: string): void {
    this.messageSnackSubject.next(msg);
  }

  setActiveView(view: 'login' | 'register') {
    this.activeViewSubject.next(view);
  }
}
