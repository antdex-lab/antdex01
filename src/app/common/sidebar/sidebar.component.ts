import { Component, OnInit } from '@angular/core';
import { ToggleService } from './toggle.service';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    isSidebarToggled = false;
    isAdminLogin: boolean = false;
    isUser1: boolean = false;
    isUser2: boolean = false;
    isToggled = false;
    panelOpenState = false;

    constructor(
        private toggleService: ToggleService,
        public themeService: CustomizerSettingsService,
        private authService: AuthService,
        private router: Router
    ) {
        this.toggleService.isSidebarToggled$.subscribe(isSidebarToggled => {
            this.isSidebarToggled = isSidebarToggled;
        });

        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.authService.isAuthenticatedAdmin$.subscribe(isAdmin => {
            this.isAdminLogin = isAdmin;
        });

        this.authService.isAuthenticatedUser1$.subscribe(isUser1 => {
            this.isUser1 = isUser1;
        });

        this.authService.isAuthenticatedUser2$.subscribe(isUser2 => {
            this.isUser2 = isUser2;
        });

        console.log("Admin ", this.isAdminLogin);
        console.log("User 1", this.isUser1);
        console.log("User 2", this.isUser2);

        this.authService.checkAuthenticationForLogin();
    }

    toggle() {
        this.toggleService.toggle();
    }

    onLogout() {
        this.authService.logout();
    }

    navigateTo() {

        if (this.isAdminLogin) {
            this.router.navigate(['/']);
        }

        if (this.isUser1) {
            this.router.navigate(['/printing']);
        }

        if (this.isUser2) {
            this.router.navigate(['/z-fold']);
        }
        // this.authService.navigateTo(route);
    }
}
