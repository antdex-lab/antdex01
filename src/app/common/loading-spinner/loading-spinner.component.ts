import {Component} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Component({
    selector: 'app-loading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent {
    static isLoading = new BehaviorSubject<boolean>(false);
    isLoading$ = LoadingSpinnerComponent.isLoading.asObservable();

    static show() {
        LoadingSpinnerComponent.isLoading.next(true);
    }

    static hide() {
        LoadingSpinnerComponent.isLoading.next(false);
    }
}
