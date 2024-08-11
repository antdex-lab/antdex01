import { Component, OnInit } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { ToggleService } from './toggle.service';
import { NgClass } from '@angular/common';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { AuthService } from '../../auth.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [NgScrollbarModule, MatExpansionModule, RouterLinkActive, RouterModule, RouterLink, NgClass, NgIf],
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
        private authService: AuthService
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

        this.authService.checkAuthenticationForLogin();
    }

    toggle() {
        this.toggleService.toggle();
    }

    onLogout() {
        this.authService.logout();
    }
}
