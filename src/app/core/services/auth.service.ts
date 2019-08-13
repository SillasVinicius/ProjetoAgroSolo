import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  constructor(private http: HttpClient, private router: Router) {}
  logado(): boolean {
    console.log(this.user);
    return this.user !== undefined;
  }
  login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>('http://localhost:3001/login', { email, password })
      .pipe(tap(user => (this.user = user)));
  }
  handleLogin() {
    this.router.navigate(['/login']);
  }
}
