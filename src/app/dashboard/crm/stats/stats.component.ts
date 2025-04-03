import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../../services/api.service";
import {LoadingSpinnerComponent} from "../../../common/loading-spinner/loading-spinner.component";
@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit{

    data: any;

    constructor(private service: ApiService){

    }

    ngOnInit() {
        this.loadData();
    }

    loadData(){
        LoadingSpinnerComponent.show();

        this.service.getData('dashboard/data').subscribe((res) => {
            if (res.statusCode === 200){
                this.data = res.data;
                LoadingSpinnerComponent.hide();
            }
        })
    }
}
