import {Component} from '@angular/core';
import {CustomizerSettingsService} from '../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

    // isToggled
    isToggled = false;

    // Password Hide
    hide = true;
    hide2 = true;

    constructor(
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

}
