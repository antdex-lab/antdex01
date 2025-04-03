import {Component} from '@angular/core';
import {ViewportScroller} from '@angular/common';
import {Event, NavigationEnd, Router} from '@angular/router';
import {CustomizerSettingsService} from './customizer-settings/customizer-settings.service';
import {ToggleService} from './common/sidebar/toggle.service';

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

    constructor(
        public router: Router,
        private toggleService: ToggleService,
        private viewportScroller: ViewportScroller,
        public themeService: CustomizerSettingsService
    ) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                // Scroll to the top after each navigation end
                this.viewportScroller.scrollToPosition([0, 0]);
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
