import { Component } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Event, NavigationEnd, Router } from '@angular/router';
import { CustomizerSettingsService } from './customizer-settings/customizer-settings.service';
import { ToggleService } from './common/sidebar/toggle.service';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {

    // isSidebarToggled
    isSidebarToggled = false;

    // isToggled
    isToggled = false;

    isAdminLogin: boolean = false;
    isUser1: boolean = false;
    isUser2: boolean = false;

    constructor(
        public router: Router,
        private toggleService: ToggleService,
        private viewportScroller: ViewportScroller,
        public themeService: CustomizerSettingsService,
        private authService: AuthService,
    ) {

        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                console.log('Navigation End:', event.url);
                // Scroll to the top after each navigation end
                this.viewportScroller.scrollToPosition([0, 0]);
                this.authService.isAuthenticatedAdmin$.subscribe(isAdmin => {
                    this.isAdminLogin = isAdmin;
                });

                this.authService.isAuthenticatedUser1$.subscribe(isUser1 => {
                    this.isUser1 = isUser1;
                });

                this.authService.isAuthenticatedUser2$.subscribe(isUser2 => {
                    this.isUser2 = isUser2;
                });

                this.authService.checkAuthenticationForLogin();

                if (event.url === "/") {
                    if (this.isAdminLogin) {
                        this.router.navigate(['/']);
                    }

                    if (this.isUser1) {
                        this.router.navigate(['/printing']);
                    }

                    if (this.isUser2) {
                        this.router.navigate(['/z-fold']);
                    }
                }
            }
        });
        this.toggleService.isSidebarToggled$.subscribe(isSidebarToggled => {
            this.isSidebarToggled = isSidebarToggled;
        });
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });

    }

}
