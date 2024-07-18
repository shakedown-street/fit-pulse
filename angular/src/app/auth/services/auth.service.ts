import { User } from '@/app/types/User';
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

export type LoginRequest = {
  username: string;
  password: string;
};

export type SignupRequest = {
  username: string;
  email: string;
  password1: string;
  password2: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user = signal<User | undefined>(undefined);

  constructor(private http: HttpClient) {
    this.http.get<User>('http://localhost:8000/api/session/').subscribe((user) => {
      this.user.set(user);
    });
  }

  public login(payload: LoginRequest) {
    return this.http.post<User>('http://localhost:8000/api/login/', payload);
  }

  public logout() {
    return this.http.post('http://localhost:8000/api/logout/', {});
  }

  public signup(payload: SignupRequest) {
    return this.http.post<User>('http://localhost:8000/api/users/', payload);
  }
}
