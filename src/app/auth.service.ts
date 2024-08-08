import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly adminUsername = 'admin';
  private readonly  adminPassword = 'admin123';

  private readonly prod1Username = 'production1';
  private readonly  prod1Password = 'production123';
  
  private readonly prod2Username = 'production2';
  private readonly  prod2Password = 'production123';

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === this.adminUsername && password === this.adminPassword) {
    
      localStorage.setItem('isAuthenticatedAdmin', 'true');
      return true;
    }else if(username === this.prod1Username && password === this.prod1Password){
      localStorage.setItem('isAuthenticatedUser1', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('isAuthenticatedAdmin');
    localStorage.removeItem('isAuthenticatedUser1');
    this.router.navigate(['/authentication']);
  }

  checkAuthentication(): boolean {
    if(localStorage.getItem('isAuthenticatedAdmin') === 'true'){
      return true;
    } else if(localStorage.getItem('isAuthenticatedUser1') === 'true'){
      return true;
    }
    return false;
  }
}
