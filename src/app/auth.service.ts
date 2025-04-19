import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly adminUsername = 'admin';
    private readonly adminPassword = 'admin123';

    private readonly prod1Username = 'prod1';
    private readonly prod1Password = 'prod1234';

    private readonly prod2Username = 'prod2';
    private readonly prod2Password = 'prod1234';

    private isAuthenticatedAdmin = new BehaviorSubject<boolean>(false);
    private isAuthenticatedUser1 = new BehaviorSubject<boolean>(false);
    private isAuthenticatedUser2 = new BehaviorSubject<boolean>(false);


    isAuthenticatedAdmin$ = this.isAuthenticatedAdmin.asObservable();
    isAuthenticatedUser1$ = this.isAuthenticatedUser1.asObservable();
    isAuthenticatedUser2$ = this.isAuthenticatedUser2.asObservable();


    constructor(private router: Router) {
        this.checkAuthenticationForLogin();
    }

    login(username: string, password: string): boolean {
        if (username === this.adminUsername && password === this.adminPassword) {
            localStorage.setItem('isAuthenticatedAdmin', 'true');
            this.isAuthenticatedAdmin.next(true);
            this.checkAuthenticationForLogin();
            return true;
        } else if (username === this.prod1Username && password === this.prod1Password) {
            localStorage.setItem('isAuthenticatedUser1', 'true');
            this.isAuthenticatedUser1.next(true);
            this.checkAuthenticationForLogin();
            return true;
        } else if (username === this.prod2Username && password === this.prod2Password) {
            localStorage.setItem('isAuthenticatedUser2', 'true');
            this.isAuthenticatedUser1.next(true);
            this.checkAuthenticationForLogin();
            return true;
        }
        return false;
    }

    logout(): void {
        localStorage.removeItem('isAuthenticatedAdmin');
        localStorage.removeItem('isAuthenticatedUser1');
        localStorage.removeItem('isAuthenticatedUser2');

        this.isAuthenticatedAdmin.next(false);
        this.isAuthenticatedUser1.next(false);
        this.isAuthenticatedUser2.next(false);

        this.router.navigate(['/authentication']);
    }

    checkAuthenticationForLogin(): void {
        const isAdmin = localStorage.getItem('isAuthenticatedAdmin') === 'true';
        const isUser1 = localStorage.getItem('isAuthenticatedUser1') === 'true';
        const isUser2 = localStorage.getItem('isAuthenticatedUser2') === 'true';

        this.isAuthenticatedAdmin.next(isAdmin);
        this.isAuthenticatedUser1.next(isUser1);
        this.isAuthenticatedUser2.next(isUser2);
    }

    checkAuthentication(): boolean {
        return this.isAuthenticatedAdmin.value || this.isAuthenticatedUser1.value || this.isAuthenticatedUser2.value;
    }
}
