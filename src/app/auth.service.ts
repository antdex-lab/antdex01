import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly username = 'admin';
  private readonly password = 'admin123';

  

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === this.username && password === this.password) {
    
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    this.router.navigate(['/authentication']);
  }

  checkAuthentication(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
}
