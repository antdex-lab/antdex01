import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../../services/api.service";
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
        this.service.getData('dashboard/data').subscribe((res) => {
            if (res.statusCode === 200){
                this.data = res.data;
            }
        })
    }
}
